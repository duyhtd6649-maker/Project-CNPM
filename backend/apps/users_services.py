from database.models.users import Users, Candidates, Companies, Recruiters
from database.models.jobs import Jobs
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from api.serializers.user_serializers import UserSerializer, RecruiterSerializer, CompanySerializer
from api.serializers.job_serializers import JobSerializer
from rest_framework.exceptions import *
from django.core.files.storage import default_storage


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
        company_name = validated_data['company']
        if company_name is not None and company_name != "":
            try:
                user = Users.objects.get(user_id = user_id)
                company = Companies.objects.get(name=company_name)
                user.company = company
                user.save()
            except Companies.DoesNotExist:
                raise NotFound({"error":"Company not found"})
        return user

    @staticmethod
    def Get_All_User():
        return Users.objects.all()

    @staticmethod
    def Get_user_profile_by_id(user_id):
        try:
            return Users.objects.get(user_id = user_id)
        except Users.DoesNotExist:
            raise NotFound({"error":"User not found"})

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
            raise Exception({"error":"recruiter not found"})
        
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

        company.logo_url = None # Xóa url 
        company.save()
        return company

        
    



        

    
