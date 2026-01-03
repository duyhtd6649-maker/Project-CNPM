from database.models.users import Users, Candidates, Recruiters
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

def Get_All_Candidates():
    try: 
        return Candidates.objects.all()
    except Candidates.DoesNotExist:
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



    

