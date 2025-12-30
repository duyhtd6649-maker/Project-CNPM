from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps import users_services
from database.models.users import Users 
from .serializers import UserSerializer
import json
import requests
from rest_framework_simplejwt.tokens import RefreshToken
import os

@api_view(['GET'])
def GetUserInfor(request):
    user = Users.objects.all()
    seriaizer = UserSerializer(user, many = True)
    return Response(seriaizer.data)

@api_view(['POST'])
def AddUser(request):
    serializer = UserSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def GetUserbyUsername(request,username):
    user = users_services.Get_User_by_username(username)
    if user == None:
        return Response({"detail":"User not found"},status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['POST'])
def UserRegister(request):
    if users_services.Email_is_avai(request):
        return Response({"detail":"Email is availabe or blank"})
    if users_services.Password_is_weak(request):
        return Response({"detail":"Password is weak or blank"})
    if users_services.Username_is_avai(request):
        return Response({"detail":"Username is available"})
    else:
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

@api_view(['POST'])
def GoogleLoginApi(self,request):
    auth_code = request.data.get('code')
    if not auth_code:
        return Response({'error': 'Missing code'}, status=400)
    payload = {
        'client_id': os.getenv('GOOGLE_CLIENT_ID'),
        'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
        'code': auth_code,
        'grant_type': 'authorization_code',
        'redirect_uri': os.getenv('GOOGLE_REDIRECT_URI')
    }
    token_respone = requests.post('https://oauth2.googleapis.com/token', data=payload)
    token_json = token_respone.json()
    if 'error' in token_json:
        return Response({'error': 'Invalid code from Google'}, status=400)
            
    access_token = token_json['access_token']
    user_info_respone = requests.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    user_info = user_info_respone.json()
    email = user_info.get('email')
    user, created = Users.objects.get_or_create(
        username=email,
        defaults={
            'email': email,
            'first_name': user_info.get('given_name', ''),
            'last_name': user_info.get('family_name', '')
        }
    )
    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'email': user.email,
            'fullname': f"{user.first_name} {user.last_name}"
        }
    })
