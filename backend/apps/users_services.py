from database.models.users import Users, Candidates, Companies, Recruiters
from database.models.jobs import Jobs
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from api.serializers.user_serializers import UserSerializer, RecruiterSerializer, CompanySerializer
from api.serializers.job_serializers import JobSerializer
from . import users_services


def Get_User_Info():
    return Users.objects.all()

def Get_User_by_username(username):
    try:
        return Users.objects.get(username=username)
    except Users.DoesNotExist:
        return None
    
def Ban_User(username):
    try:
        user = Users.objects.get(username = username)
        user.is_active = False
        user.save()
        return True
    except Users.DoesNotExist:
        return False
    
def UnBan_User(username):
    try:
        user = Users.objects.get(username = username)
        user.is_active = True
        user.save()
        return True
    except Users.DoesNotExist:
        return False
    
def Remove_User(username):
    try:
        user = Users.objects.get(username = username)
        user.delete()
        return True
    except Users.DoesNotExist:
        return False
    
def User_is_active(username):
    try:
        user = Users.objects.get(username = username)
        if user.is_active:
            return True
        else:
            return False
    except Users.DoesNotExist:
        return False

def Get_All_Candidates():
    try: 
        return Candidates.objects.all()
    except Candidates.DoesNotExist:
        return None
    
def Get_All_Recruiters():
    try: 
        return Users.objects.all()
    except Users.DoesNotExist:
        return None

def Black_list_token(refresh_token_string):
    try:
        refrest_token = RefreshToken(refresh_token_string)
        refrest_token.blacklist()
        return True
    except TokenError:
        return False
    except Exception:
        return False

def Is_Recruiter(user):
    try:
        Users.objects.get(role = user.role)
        return True
    except Users.DoesNotExist:
        return False

def Is_Super_User(user):
    if user.is_superuser:
        return True
    else:
        return False

def Same_Company(user, job_id):
    if Is_Recruiter(user):
        company_of_user = user.company
        if Jobs.objects.filter(
            id=job_id,
            companiesid=company_of_user
        ).exists():
            return True
        else:
            return False
    else: 
        return False

def User_Have_Company(user, company_id):
    company_of_recruiter = user.company
    if Companies.objects.filter(
        id = company_id,
        companiesid = company_of_recruiter
    ).exists():
        return True
    else:
        return False

def Get_User_Company(user):
        try:
            return user.company
        except Exception as e:
            raise ValueError(f"{e}")

class UserServices:

    @staticmethod
    def get_profile(user):
        return 200, UserSerializer(user).data

    @staticmethod
    def update_profile(user, data):
        company_name = data.pop('company_name', None)
        
        serializer = UserSerializer(user, data=data, partial=True)
        if not serializer.is_valid():
            return 400, serializer.errors
        serializer.save()

        if company_name is not None and company_name != "":
            try:
                company = Companies.objects.get(name=company_name)
                user.company = company
                user.save()
            except Companies.DoesNotExist:
                return 400, {"company_name": "Company not found"}

        return 200, UserSerializer(user).data


class RecruiterService: 
    @staticmethod   
    def create_job(user, data):
        if not users_services.Is_Recruiter(user):
            raise PermissionError("User don't have permission")

        company = Get_User_Company(user)
        try:
            new_job = Jobs.objects.create(**data,company=company)
            return new_job
        except Exception as e:
            raise Exception(f"error: {e}")
        
    @staticmethod
    def fix_job(user, data, job_id):
        recruiter = users_services.Is_Recruiter(user)
        superuser = users_services.Is_Super_User(user)
        samecompany = users_services.Same_Company(user, job_id)

        if not (recruiter and samecompany) and not superuser:
            return 403, {"detail": "You don't work for this company"}

        try:
            job = Jobs.objects.get(id=job_id)
        except Jobs.DoesNotExist:
            return 404, {"detail": "Job not found"}

        serializer = JobSerializer(job, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return 200, serializer.data
        return 400, serializer.errors
        
    def delete_job(user, job_id):
        recruiter = users_services.Is_Recruiter(user)
        superuser = users_services.Is_Super_User(user)
        samecompany = users_services.Same_Company(user, job_id)

        if not (recruiter and samecompany) and not superuser:
            return 403, {"detail": "You don't work for this company"}
        try:
            job = Jobs.objects.get(id=job_id)
        except Jobs.DoesNotExist:
            return 404, {"detail": "Job not found"}

        job.delete()
        return 200, {"detail": "Job deleted successfully"}

    @staticmethod
    def create_company(user, data):
        recruiter = users_services.RecruiterService.get_recruiter(user)
        is_recruiter = users_services.Is_Recruiter(user)   
        superuser = users_services.Is_Super_User(user)
        if not is_recruiter and not superuser:
            return 403, {"detail": "not a recruiter"}
        if recruiter and recruiter.company is not None:
            return 400, {"detail": "you already belong to a company"}
        
        serializer = CompanySerializer(data = data)
        if not serializer.is_valid():
            return 400, serializer.errors
        
        company = serializer.save()

        if recruiter:
            recruiter.company = company
            recruiter.save()
        return 201, {"detail": "company has been created"}
        
    @staticmethod
    def delete_company(user, id):
        recruiter = users_services.Is_Recruiter(user)
        if not recruiter:
            return 403, {"detail": "User is not recruiter"}
        try:
            company = Companies.objects.get(id=id)
        except Companies.DoesNotExist:
            return 404, {"detail": "company not found"}
        company.delete()
        return 200, {"detail": "company deleted"}


        

    
