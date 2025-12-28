from database.models.users import Users

def Get_User_by_username(username):
    try:
        return Users.objects.get(username=username)
    except Users.DoesNotExist:
        return None



def Email_is_avai(request):
    data = request.data
    email = data.get('email')
    if not email:
        return True
    try:
        Users.objects.get(email = email)
        return True
    except Users.DoesNotExist:
        return False
    
def Password_is_weak(request):
    data = request.data
    password = data.get('password')
    if not password:
        return True
    if len(password) <= 8:
        return True
    else:
        return False

def Username_is_avai(request):
    data = request.data
    username = data.get('username')
    if not username:
        return True
    try:
        Users.objects.get(username = username)
        return True
    except Users.DoesNotExist:
        return False
    

