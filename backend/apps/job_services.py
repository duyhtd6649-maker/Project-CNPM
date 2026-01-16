from database.models.jobs import Jobs
from .users_services import UserService, CompanyService, RecruiterService, AdminService
from rest_framework.exceptions import *


class JobService:
    @staticmethod
    def Get_all_job():
        return Jobs.objects.filter(isdeleted = False)


    #ham ktra perrmission
    @staticmethod
    def check_job_modify_permission(user, job):
        try:
            recruiter_create_job = getattr(job,'recruiter',None)
            recruiter = RecruiterService.Get_recruiter(user)
            is_super_user = AdminService.Is_Super_User(user)
            same_company = RecruiterService.Is_Recruiter_Of_Company(user, job.company_id)
        except Exception as e:
            return False
        if (recruiter == recruiter_create_job) or same_company or is_super_user:
            return True
        else:
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
            raise PermissionError({"error":"user don't have permission"})
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
            raise PermissionError({"error":"user don't have permission"})
        job.isdeleted = True
        job.save()
        return job
    
    @staticmethod
    def create_job(user, validated_data):
        if not RecruiterService.Is_Recruiter(user):
            raise PermissionError("User don't have permission")

        company = CompanyService.Get_User_Company(user)
        try:
            recruiter = RecruiterService.Get_recruiter(user)
            return Jobs.objects.create(**validated_data,company=company,recruiter=recruiter)
        except Exception as e:
            raise Exception(f"error: {e}")