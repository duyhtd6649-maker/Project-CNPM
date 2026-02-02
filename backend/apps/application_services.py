from email.mime import application
from database.models.jobs import Jobs, Applications
from database.models.users import Candidates, Recruiters
from database.models.CV import Cvs
from .users_services import UserService, CompanyService, RecruiterService, AdminService
from rest_framework.exceptions import *

class ApplicationService:
    @staticmethod
    def application_exists(candidate, job):
        return Applications.objects.filter(candidate=candidate, job=job, isdeleted=False).exists()

    @staticmethod
    def apply_job(user, job_id, cvsid):
        try:
            job = Jobs.objects.get(id=job_id, status = 'Open')
            candidate = Candidates.objects.get(user = user)
            if not ApplicationService.application_exists(candidate, job):
                cv = Cvs.objects.get(id=cvsid.id, candidate=candidate)
                application = Applications.objects.create(job=job,candidate=candidate,cvsid=cv,system_status='Pending')
                return application
            else:
                raise ValueError("Application already exists, please delete old application before applying again.")
        except Jobs.DoesNotExist:
            raise NotFound("Job not found")
        except Candidates.DoesNotExist:
            raise NotFound("Candidate or CV not found")
        except Cvs.DoesNotExist:
            raise NotFound("CV not found")
        except Exception as e:
            raise Exception(f"Error: {str(e)}")
        
    @staticmethod
    def delete_application(user, id):
        try:
            application = Applications.objects.get(id=id,isdeleted=False)
            is_admin = AdminService.Is_Super_User(user)
            if is_admin:
                application.isdeleted = True
                application.save()
                return application
            else:
                candidate_instance = Candidates.objects.get(user=user)
                if application.candidate_id != candidate_instance.id or application.job_status == 'Hired' or application.job_status == 'Scheduling':
                    raise PermissionDenied("User doesn't have permission or application is processing")
                application.isdeleted = True
                application.save()
                return application
        except Applications.DoesNotExist:
            raise NotFound("Application not found")
        except Candidates.DoesNotExist:
            raise PermissionDenied("User doesn't have permission")
        except Exception as e:
            raise Exception(f"Error: {str(e)}")
        
    @staticmethod
    def get_applications(user,filters):
        if filters.get('company_id') is not None:
            company_id = filters.get('company_id')
            permission = RecruiterService.Is_Recruiter_Of_Company(user, company_id)
            if not permission:
                raise PermissionDenied("User doesn't have permission")
            applications = Applications.objects.filter(job__company_id=company_id, isdeleted=False)
        else:
            permission = RecruiterService.Is_Recruiter(user)
            if not permission:
                raise PermissionDenied("User doesn't have permission")
            recruiter = RecruiterService.Get_recruiter(user)
            applications = Applications.objects.filter(job__recruiter=recruiter, isdeleted=False)
        if filters.get('job_status') is not None:
            applications = applications.filter(job_status=filters.get('job_status'))
        if filters.get('job_title') is not None:
            applications = applications.filter(job__title__icontains=filters.get('job_title'))
        return applications

    @staticmethod
    def get_applications_of_user(user_id):
        try:
            candidate = Candidates.objects.get(user_id=user_id)
            applications = Applications.objects.filter(candidate=candidate, isdeleted=False)
            return applications
        except Candidates.DoesNotExist:
            raise NotFound("Candidate not found")
        except Exception as e:
            raise Exception(f"Error: {str(e)}")
        
    @staticmethod
    def get_application_by_id(user, application_id):
        try:
            application = Applications.objects.get(id=application_id, isdeleted=False)
            is_admin = AdminService.Is_Super_User(user)
            company = application.job.company
            if is_admin:
                return application
            elif RecruiterService.Is_Recruiter_Of_Company(user, company.id):
                return application
            elif application.candidate.user_id == user.id:
                return application
            else:
                raise PermissionDenied("User doesn't have permission to access this application")
        except Applications.DoesNotExist:
            raise NotFound("Application not found")
        
    @staticmethod
    def get_application_by_filters(user, filters):
        is_admin = AdminService.Is_Super_User(user)
        if not is_admin:
            raise PermissionDenied("User doesn't have permission")
        queryset = Applications.objects.filter(isdeleted=False)
        if filters.get('company_id') is not None:
            queryset = queryset.filter(job__company_id=filters.get('company_id'))
        if filters.get('company_name') is not None:
            queryset = queryset.filter(job__company__name__icontains=filters.get('company_name'))
        if filters.get('system_status') is not None:
            queryset = queryset.filter(system_status=filters.get('system_status'))
        if filters.get('job_id') is not None:
            queryset = queryset.filter(job_id=filters.get('job_id'))
        if filters.get('job_title') is not None:
            queryset = queryset.filter(job__title__icontains=filters.get('job_title'))
        return queryset
    
    @staticmethod
    def update_application_system_status(user, application_id, new_status):
        try:
            application = Applications.objects.get(id=application_id, isdeleted=False)
        except Applications.DoesNotExist:
            raise NotFound("Application not found")
        is_admin = AdminService.Is_Super_User(user)
        if is_admin:
            application.system_status = new_status
            if new_status == 'Approved':
                application.job_status = 'Waiting'
            else:
                application.job_status = None
            application.save()
            return application
        else:
            raise PermissionDenied("User doesn't have permission to update system status")

        
    @staticmethod
    def update_application_job_status(user, application_id, new_status):
        try:
            application = Applications.objects.get(id=application_id, isdeleted=False)
            recruiter = RecruiterService.Get_recruiter(user)
        except Applications.DoesNotExist:
            raise NotFound("Application not found")
        except NotFound:
            raise PermissionDenied("User doesn't have permission")
        is_recruiter_of_company = False
        company = application.job.company
        if company is not None:
            is_recruiter_of_company = RecruiterService.Is_Recruiter_Of_Company(user, company.id)
        if (is_recruiter_of_company or application.job.recruiter == recruiter) and application.system_status == 'Approved':  
            application.job_status = new_status
            application.save()
            return application
        else:
            raise PermissionDenied("User doesn't have permission to update job status")