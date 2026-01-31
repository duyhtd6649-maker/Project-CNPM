from email.mime import application
from database.models.jobs import Jobs, Applications
from database.models.users import Candidates, Recruiters
from database.models.CV import Cvs
from .users_services import UserService, CompanyService, RecruiterService, AdminService
from rest_framework.exceptions import *


class JobService:
    @staticmethod
    def Get_all_job():
        return Jobs.objects.filter(isdeleted = False)
    
    @staticmethod
    def Get_job(user):
        try:
            recruiter = RecruiterService.Get_recruiter(user)
            jobs = Jobs.objects.filter(recruiter=recruiter, isdeleted=False)
            return jobs
        except NotFound:
            raise PermissionDenied("User don't have permission")
    
    #ham ktra perrmission
    @staticmethod
    def check_job_modify_permission(user, job):
        try:
            if AdminService.Is_Super_User(user):
                return True
            recruiter_create_job = getattr(job, 'recruiter', None)
            try:
                recruiter = RecruiterService.Get_recruiter(user)
                same_company = RecruiterService.Is_Recruiter_Of_Company(user, job.company_id)
            except NotFound:
                recruiter = None
            if recruiter_create_job is not None and recruiter is not None:
                if str(getattr(recruiter, 'id', None)) == str(getattr(recruiter_create_job, 'id', None)):
                    return True
            if same_company:
                return True
            return False
        except Exception:
            return False

    @staticmethod
    def update_job(user, validated_data, job_id):
        try:
            job = Jobs.objects.get(id = job_id)
            permission = JobService.check_job_modify_permission(user, job)
        except Jobs.DoesNotExist:
            raise NotFound({"error":"job not found"})
        except Exception as e:
            raise Exception({"error":f"{str(e)}"})
        if not permission:
            raise PermissionDenied({"error":"user don't have permission"})
        #gan du lieu moi vao instance job
        for key, value in validated_data.items():
            setattr(job, key, value)
        job.save()
        return job
        
    @staticmethod    
    def delete_job(user, job_id):
        try:
            job = Jobs.objects.get(id = job_id)
            permission = JobService.check_job_modify_permission(user, job)
        except Jobs.DoesNotExist:
            raise NotFound({"error":"job not found"})
        except Exception as e:
            raise Exception({"error":f"{str(e)}"})
        if not permission:
            raise PermissionDenied({"error":"user don't have permission"})
        job.isdeleted = True
        job.save()
        return job
    
    @staticmethod
    def create_job(user, validated_data):
        if not RecruiterService.Is_Recruiter(user):
            raise PermissionDenied("User don't have permission")

        company = CompanyService.Get_User_Company(user)
        try:
            recruiter = RecruiterService.Get_recruiter(user)
            return Jobs.objects.create(**validated_data,company=company,recruiter=recruiter)
        except Exception as e:
            raise Exception(f"error: {e}")
        
    @staticmethod
    def search_jobs(search_term = None, location = None, job_type = None):
        queryset = Jobs.objects.all()
        if search_term:
            qs_title = Jobs.objects.filter(title__icontains=search_term)
            qs_company = Jobs.objects.filter(company__icontains=search_term)
            qs_description = Jobs.objects.filter(description__icontains=search_term)
            
            queryset = (qs_title | qs_company | qs_description).distinct()
            
        filter = {}
        if location:
            filter['location__icontains'] = location
        if job_type:
            filter['job_type__iexact'] = job_type
        
        if filter:
            queryset = queryset.filter(**filter)
        return queryset.order_by('-created_date')

        
    
