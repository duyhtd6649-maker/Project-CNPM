from email.mime import application
from database.models.jobs import Jobs, Categories
from database.models.users import Candidates, Recruiters
from database.models.CV import Cvs, Cvanalysisresult
from .users_services import UserService, CompanyService, RecruiterService, AdminService
from rest_framework.exceptions import *
from django.db.models import Case, When, Value, IntegerField, F


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
            return Jobs.objects.create(**validated_data,company=company,recruiter=recruiter, status='Pending')
        except Exception as e:
            raise Exception(f"error: {e}")
        
    @staticmethod
    def search_jobs(filters):
        job_list = Jobs.objects.filter(isdeleted=False)
        if filters.get('title') is not None:
            job_list = job_list.filter(title__icontains=filters.get('title'))
        if filters.get('description') is not None:
            job_list = job_list.filter(description__icontains=filters.get('description'))
        if filters.get('location') is not None:
            job_list = job_list.filter(location__icontains=filters.get('location'))
        if filters.get('category') is not None:
            try:
                category = Categories.objects.get(name=filters.get('category'))
                job_list = job_list.filter(category=category)
            except Categories.DoesNotExist:
                raise NotFound("Category not found")
        if filters.get('Skill') is not None:
            skills = filters.getlist('Skill')
            for skill in skills:
                job_list = job_list.filter(skill__icontains=skill)
        job_list = job_list.order_by('-created_date')
        return job_list
    
    @staticmethod
    def close_job(user, job_id):
        try:
            job = Jobs.objects.get(id = job_id)
            permission = JobService.check_job_modify_permission(user, job)
        except Jobs.DoesNotExist:
            raise NotFound("Job not exist")
        if permission == True:
            job.status = 'Closed'
            job.save()
        return job

    @staticmethod
    def get_recommended_jobs(user):
        try:
            candidate = Candidates.objects.get(user=user)
            candidate_skills = []
            cv = Cvs.objects.filter(candidate=candidate, isdeleted=False).first()
            if cv is not None:
                cv_analysis = Cvanalysisresult.objects.filter(cv=cv, isdeleted=False).first()
                if cv_analysis and cv_analysis.extracted_skill:
                    candidate_skills = cv_analysis.extracted_skill 
            skill_score_expression = Value(0, output_field=IntegerField())
            if candidate_skills:
                for skill in candidate_skills:
                    skill_score_expression = skill_score_expression + Case(
                        When(skills__contains=skill, then=Value(10)),
                        default=Value(0),
                        output_field=IntegerField()
                    )
            recommended_jobs = Jobs.objects.filter(isdeleted=False).annotate(
                total_score=skill_score_expression
            ).filter(
                total_score__gt=0
            ).order_by('-total_score', '-created_date')
            return recommended_jobs
        except Candidates.DoesNotExist:
            raise PermissionDenied("User is not a candidate")


        
    
