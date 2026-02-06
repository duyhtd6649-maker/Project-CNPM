
from database.models.users import Users, Candidates, Companies, Recruiters
from database.models.jobs import Jobs, Applications
from database.models.services import Interviews
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from api.serializers.user_serializers import UserSerializer, RecruiterSerializer, CompanySerializer
from api.serializers.job_serializers import JobSerializer
from rest_framework.exceptions import *
from django.core.files.storage import default_storage
import os


class UserService:
    @staticmethod
    def user_signup_role(user, role):
        user.role = role 
        user.save()
        if role == 'candidate':
            Candidates.objects.create(user=user)
        if role == 'recruiter':
            Recruiters.objects.create(user=user)


    @staticmethod
    def update_profile(user_id, validated_data):
        try:
            user = Users.objects.get(id=user_id) 
            company_name = validated_data.pop('company', None) 
            
            if company_name: 
                try:
                    company = Companies.objects.get(name=company_name)
                    user.company = company
                except Companies.DoesNotExist:
                    raise NotFound({"error": "Company not found"})
            
            user.phone = validated_data.get('phone', user.phone)
            user.first_name = validated_data.get('first_name', user.first_name)
            user.last_name = validated_data.get('last_name', user.last_name)

            if 'avatar_url' in validated_data:
                user.avatar_url = validated_data['avatar_url']

            user.save()
            return user
            
        except Users.DoesNotExist:
            raise NotFound({"error": "User not found"})
        
    @staticmethod
    def update_candidate_profile(user, validated_data):
        try:
            # Removed isdeleted=False to allow soft-deleted candidates to update profile (consistent with view_my_profile)
            candidate = Candidates.objects.get(user = user) 
            
            # Extract user fields that might be at root level due to serializer flattening (FormData usage)
            user_data = validated_data.pop('user', {})
            user_fields = ['first_name', 'last_name', 'phone', 'avatar']
            for field in user_fields:
                if field in validated_data:
                    user_data[field] = validated_data.pop(field)
            
            instance = UserService.update_profile(user_id=user.id, validated_data=user_data)
            candidate.description = validated_data.get('description', candidate.description)
            candidate.address = validated_data.get('address', candidate.address)
            candidate.date_of_birth = validated_data.get('date_of_birth', candidate.date_of_birth)
            candidate.save()
            return candidate
        except Candidates.DoesNotExist:
            raise NotFound({"error":"candidate not found"})
        except NotFound as e:
            raise NotFound({f"{e}"})
            
    @staticmethod   
    def upload_avatar(user, file_data):
        user.avatar_url = file_data
        user.save()
        return user

    @staticmethod
    def Get_All_User():
        return Users.objects.all()

    @staticmethod
    def Get_user_profile_by_id(user_id):
        try:
            instance = Users.objects.get(id = user_id)
            role = instance.role
            if role == 'candidate':
                return role, Candidates.objects.get(user_id = user_id)
            elif role == 'recruiter':
                return role, Recruiters.objects.get(user_id = user_id)
            else:
                return role,instance
        except Users.DoesNotExist:
            raise NotFound({"error":"User not found"})
        except Candidates.DoesNotExist:
            raise NotFound({"error":"Candidate not found"})
        except Recruiters.DoesNotExist:
            raise NotFound({"error":"Recruiter not found"})
    @staticmethod
    def Get_user_profile_by_username(username):
        try:
            return Users.objects.get(username=username)
        except Users.DoesNotExist:
            raise NotFound({"error":"User not found"})
        
    @staticmethod    
    def User_is_active(username):
        try:
            user = Users.objects.get(username = username)
            if user.is_active:
                return True
            else:
                return False
        except Users.DoesNotExist:
            raise NotFound({"error":"User not found"})

    @staticmethod    
    def Get_All_Candidates():
        return Candidates.objects.all()

    @staticmethod    
    def Black_list_token(refresh_token_string):
        try:
            refrest_token = RefreshToken(refresh_token_string)
            refrest_token.blacklist()
            return True
        except TokenError:
            raise TokenError({"error":"Token error"})
        except Exception as e:
            raise Exception({"error":f"{str(e)}"})
        
    @staticmethod 
    def delete_cv_of_user(user_id, cv_id):
        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            raise NotFound({"error":"User not found"})
        try:
            candidate = Candidates.objects.get(user=user)
        except Candidates.DoesNotExist:
            raise NotFound({"error":"Candidate not found"})
        try:
            cv = candidate.cvs.get(id=cv_id)
            cv.isdeleted = True
            cv.save()
            return cv
        except Exception as e:
            raise NotFound({"error":"CV not found"})
    
    def get_candidate_profile_by_id(candidate_id, user):
        try:
            candidate = Candidates.objects.get(id = candidate_id, user = user)
            return candidate
        except Candidates.DoesNotExist:
            raise NotFound({"error":"Candidate not found"})
    
    def get_user_profile(user):
        try:
            if user.role == 'candidate':
                return Candidates.objects.get(user = user)
            elif user.role == 'recruiter':
                return Recruiters.objects.get(user = user)
            else:
                return Users.objects.get(id = user.id)
            
        except Users.DoesNotExist:
            raise NotFound({"error":"User not found"})
        except Candidates.DoesNotExist:
            raise NotFound({"error":"Candidate not found"})
        except Recruiters.DoesNotExist:
            raise NotFound({"error":"Recruiter not found"})
    
    def view_my_profile(user):
        try:
            if user.role == 'candidate':
                return Candidates.objects.get(user=user) 
            elif user.role == 'recruiter':
                return Recruiters.objects.get(user=user)
            else:
                return user
                    
        except Users.DoesNotExist:
            raise NotFound({"error":"User not found"})
        except Candidates.DoesNotExist:
            raise NotFound({"error":"Candidate not found"})
        except Recruiters.DoesNotExist:
            raise NotFound({"error":"Recruiter not found"})


class AdminService:
    @staticmethod    
    def Is_Super_User(user):
        if user.is_superuser:
            return True
        else:
            return False
        
    @staticmethod    
    def Ban_User(request_user, username):
        if AdminService.Is_Super_User(request_user):
            try:
                user = Users.objects.get(username = username)
                user.is_active = False
                user.save()
                return None
            except Users.DoesNotExist:
                raise NotFound({"error":"User not found"})
        else:
            raise PermissionDenied({"error":"user don't have permission"})
        
    @staticmethod    
    def UnBan_User(request_user, username):
        if AdminService.Is_Super_User(request_user):
            try:
                user = Users.objects.get(username = username)
                user.is_active = True
                user.save()
                return None
            except Users.DoesNotExist:
                raise NotFound({"error":"User not found"})
        else:
            raise PermissionDenied({"error":"user don't have permission"})
        
    @staticmethod    
    def Remove_User(request_user, username):
        if AdminService.Is_Super_User(request_user):
            try:
                user = Users.objects.get(username = username)
                user.isdeleted = True
                user.save()
                return None
            except Users.DoesNotExist:
                raise NotFound({"error":"User not found"})
        else:
            raise PermissionDenied({"error":"user don't have permission"})
        
    @staticmethod
    def admin_dashboard_stats(self):
        if not AdminService.Is_Super_User(self):
            raise PermissionDenied({"error":"user don't have permission"})
        else:
            total_users = Users.objects.filter(isdeleted=False).count()
            total_candidates = Candidates.objects.filter(isdeleted=False).count()
            total_recruiters = Recruiters.objects.filter(isdeleted=False).count()
            total_companies = Companies.objects.filter(isdeleted=False).count()
            total_jobs = Jobs.objects.filter(isdeleted=False).count()
            total_job_pending = Jobs.objects.filter(isdeleted=False, status='pending').count()
            total_applications = Applications.objects.filter(isdeleted=False).count()

            stats = {
                "total_users": total_users,
                "total_candidates": total_candidates,
                "total_recruiters": total_recruiters,
                "total_companies": total_companies,
                "total_jobs": total_jobs,
                "total_job_pending": total_job_pending,
                "total_applications": total_applications,
            }
            return stats

class RecruiterService:   
    @staticmethod    
    def Is_Recruiter(user):
        if user.role == "recruiter":
            return True
        else:
            return False

    @staticmethod    
    def Get_All_Recruiters():
        return Recruiters.objects.all()
    
    @staticmethod
    def Get_recruiter(user):
        try:
            return Recruiters.objects.get(user = user)
        except Recruiters.DoesNotExist:
            raise NotFound({"error":"recruiter not found"})
        
    @staticmethod
    def Is_Recruiter_Of_Company(user, company_id):
        is_recruiter = Recruiters.objects.filter(user=user).exists()
        if not is_recruiter:
            return False
        return (user.company_id is not None) and (user.company_id == company_id)
    

class CompanyService:
    @staticmethod
    def Get_all_company():
        return Companies.objects.all()

    @staticmethod    
    def User_Have_Company(user, company_id):
        company_of_recruiter = user.company
        if Companies.objects.filter(
            id = company_id,
            companiesid = company_of_recruiter
        ).exists():
            return True
        else:
            return False

    @staticmethod    
    def Get_User_Company(user):
            try:
                return user.company
            except Exception as e:
                raise ValueError(f"{e}")
    @staticmethod
    def create_company(user, validated_data):
        try:
            recruiter = RecruiterService.Get_recruiter(user)
            is_recruiter = RecruiterService.Is_Recruiter(user)   
            superuser = AdminService.Is_Super_User(user)
        except NotFound:
            raise NotFound({"error":"recruiter not found"})
        except Exception as e:
            raise Exception({"error":f"{str(e)}"})
        if not is_recruiter and not superuser:
            raise PermissionError({"error":"user don't have permission"})
        if user.company is not None:
            raise ValidationError({"error":"recruiter already had company"})
        company = Companies.objects.create(**validated_data)
        setattr(user, 'company', company)
        user.save()
        return company
        
    @staticmethod
    def delete_company(user, id):
        if AdminService.Is_Super_User(user) or RecruiterService.Is_Recruiter_Of_Company(user,id):
            try:
                company = Companies.objects.get(id=id)
                company.isdeleted = True
                company.save()
            except Companies.DoesNotExist:
                raise NotFound({"error":"company not found"})
            return company
        else:
            raise PermissionError({"error":"user don't have permission"})
    
    @staticmethod
    def update_company_info(user, company_id, data):
        company = Companies.objects.get(id=company_id)
        
        is_owner = (user.company == company) if user.company else False
        if not user.is_superuser and not is_owner:
            raise PermissionDenied({"error": "You don't have permission to update this company"})

        if 'name' in data: company.name = data['name']
        if 'description' in data: company.description = data['description']
        if 'website' in data: company.website = data['website']
        if 'address' in data: company.address = data['address']
        if 'tax_code' in data: company.tax_code = data['tax_code']
        
        company.save()
        return company

    @staticmethod
    def upload_logo(user, company_id, file_data):
        company = Companies.objects.get(id=company_id)

        is_owner = (user.company == company) if user.company else False
        if not user.is_superuser and not is_owner:
            raise PermissionDenied({"error": "You don't have permission to update this company logo"})

        file_path = default_storage.save(f"logos/{file_data.name}", file_data)
        file_url = default_storage.url(file_path)
        
        #đường dẫn vào DB
        company.logo_url = file_url
        company.save()
        return company

    @staticmethod
    def delete_logo(user, company_id):
        company = Companies.objects.get(id=company_id)
        # Check quyền
        is_owner = (user.company == company) if user.company else False
        if not user.is_superuser and not is_owner:
            raise PermissionDenied({"error": "You don't have permission to update this company logo"})

        company.logo_url = None # xoa url 
        company.save()
        return company
    
    @staticmethod
    def list_recruiters_of_company(user, company_id):
        company = Companies.objects.get(id=company_id)

        is_owner = (user.company == company) if user.company else False
        if not user.is_superuser and not is_owner:
            raise PermissionDenied({"error": "You don't have permission to view recruiters of this company"})

        recruiters = Recruiters.objects.filter(user__company_id=company_id)
        return recruiters


    @staticmethod
    def delete_recruiter_from_company(user, company_id, recruiter_id):
        try:
            target_company = Companies.objects.get(id=company_id)
        except Companies.DoesNotExist:
            raise NotFound("company not found")

        if user.company != target_company:
             raise PermissionDenied("You don't have permission to view recruiters of this company")

        try:
            recruiter = Recruiters.objects.get(id=recruiter_id, user__company_id=company_id)
            target_user = recruiter.user
            target_user.company = None
            target_user.save()
            
            return True

        except Recruiters.DoesNotExist:
            raise NotFound("Recruiter not found in this company")
    
    @staticmethod
    def add_recruiter_to_company(user, company_id, recruiter_id):
        try:
            target_company = Companies.objects.get(id=company_id)
        except Companies.DoesNotExist:
            raise NotFound("company not found")

        if user.company != target_company:
             raise PermissionDenied("You don't have permission to add recruiters to this company")

        try:
            recruiter = Recruiters.objects.get(id=recruiter_id)
            target_user = recruiter.user
            target_user.company = target_company
            target_user.save()
            
            return True

        except Recruiters.DoesNotExist:
            raise NotFound("Recruiter not found")
        
    @staticmethod
    def search_company(filters):
        company_list = Companies.objects.filter(isdeleted = False)
        if filters.get('name'):
            company_list = company_list.filter(name__icontains = filters.get('name'))
        if filters.get('address'):
            company_list = company_list.filter(address = filters.get('address'))
        return company_list
    
    @staticmethod
    def company_detail(company_id):
        try:
            return Companies.objects.get(id = company_id, isdeleted = False)
        except Companies.DoesNotExist:
            raise NotFound({"error":"Company not found"})
        
    @staticmethod
    def view_user_company_profile(user):
        try:
            if user.company is None:
                raise NotFound({"error":"User has no company"})
            return Companies.objects.get(id=user.company.id, isdeleted = False)
        except Companies.DoesNotExist:
            raise NotFound({"error":"Company not found"})   

class interviewService:
    @staticmethod
    def get_approved_candidates(recruiter_user):
        if not recruiter_user.role == 'recruiter':
            raise PermissionDenied("User is not a recruiter")
        
        apps = Applications.objects.filter(
            job__recruiter__user=recruiter_user,
            system_status='approved'
        ).select_related('candidate__user', 'job')
        return apps

    def create_interview(recruiter_user, application_id, interview_date, location, note=''):
        if getattr(recruiter_user, 'role', '') != 'recruiter':
            raise PermissionDenied("User is not a recruiter")
        try:
            application = Applications.objects.get(
                id=application_id, 
                job__company=recruiter_user.company 
            )
        except Applications.DoesNotExist:
            raise NotFound("Application not found or you don't have permission")
        interview = Interviews.objects.create(
            recruiter=recruiter_user,
            candidate=application.candidate,
            job=application.job,
            scheduled_time=interview_date, 
            location=location,             
            note=note,              
            status='scheduled'
        )

        application.system_status = 'interviewing'
        application.save()

        return interview
    
    @staticmethod
    def update_interview(recruiter_user, interview_id, interview_date=None, location=None, note=None):
        try:
            interview = Interviews.objects.get(
                id=interview_id,
                recruiter=recruiter_user 
            )
        except Interviews.DoesNotExist:
            raise NotFound("Interview not found or you don't have permission")

        if interview_date:
            interview.scheduled_time = interview_date
        if location:
            interview.location = location

        if note is not None:
            interview.notes = note 

        interview.save()
        return interview
