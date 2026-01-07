from database.models.users import Users, Candidates, Recruiters, Companies
from database.models.jobs import Jobs
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

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
        return Recruiters.objects.all()
    except Recruiters.DoesNotExist:
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
        recruiter = Recruiters.objects.get(user=user)
        return recruiter
    except Recruiters.DoesNotExist:
        return None

def Is_Super_User(user):
    if user.is_superuser:
        return True
    else:
        return False

def Same_Company(user, job_id):
    company_of_recruiter = user.recruiter_profile.company

    if Jobs.objects.filter(
        id=job_id,
        companiesid=company_of_recruiter
    ).exists():
        return True
    else:
        return False

def User_Have_Company(user, company_id):
    company_of_recruiter = user.recruiter_profile.company
    
    if Companies.objects.filter(
        id = company_id,
        companiesid = company_of_recruiter
    ).exists():
        return True
    else:
        return False





    

