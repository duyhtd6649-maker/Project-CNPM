from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
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
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def HelloView(request):
    content = {'message': 'hello'}
    return Response(content)

