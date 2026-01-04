from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from apps import users_services, cv_services
from database.models.users import Users
from database.models.jobs import Jobs 
from .serializers import UserSerializer, CVScanSerializer, LogoutSerializer, CandidateSerializer, UserNameSerializer, JobSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import json
import requests
import os
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def GetUserInfor(request):
    user = Users.objects.all()
    serializer = UserSerializer(user, many = True)
    return Response(serializer.data)

@swagger_auto_schema(
    method='put',
    operation_description="ban",
    request_body=UserNameSerializer,
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def BanUser(request):
    serializer = UserNameSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    username = serializer.validated_data['username']
    if users_services.Ban_User(username):
        return Response({"detail":"Banned"},status=status.HTTP_202_ACCEPTED)
    else:
        return Response({"detail":"User not found"},status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    operation_description="remove",
    request_body=UserNameSerializer,
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def RemoveUser(request):
    serializer = UserNameSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    username = serializer.validated_data['username']
    if users_services.Remove_User(username):
        return Response({"detail":"Removed"},status=status.HTTP_202_ACCEPTED)
    else:
        return Response({"detail":"User not found"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUserbyUsername(request,username):
    user = users_services.Get_User_by_username(username)
    if user == None:
        return Response({"detail":"User not found"},status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
def GetCandidatesInfor(request):
    candidate = users_services.Get_All_Candidates()
    serializer = CandidateSerializer(candidate, many = True)
    return Response(serializer.data)


@swagger_auto_schema(
    method='post',
    operation_description="Upload CV PDF và Target Job để phân tích",
    manual_parameters=[
        openapi.Parameter(
            name='file',
            in_=openapi.IN_FORM,
            type=openapi.TYPE_FILE,
            required=True,
            description='File PDF CV'
        ),
        openapi.Parameter(
            name='targetjob',
            in_=openapi.IN_FORM,
            type=openapi.TYPE_STRING,
            required=True,
            description='Ví dụ: Senior Python Developer'
        ),
    ],
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def Analyze_Cv(request):
    serializer = CVScanSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    upload_file = serializer.validated_data['file']
    target_job = serializer.validated_data['targetjob']
    scanned_text = cv_services.extract_text_from_cv(upload_file)

    if not scanned_text:
        return Response({"detail": "PDF is blank or unreadable"}, status=status.HTTP_400_BAD_REQUEST)
    
    payload = {"cvText":scanned_text,"targetJob":target_job}
    try:
        response = requests.post('http://localhost:8001/ai/cv/analyzer',json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        return Response(data.get("result"),status=status.HTTP_200_OK)
    except requests.exceptions.ConnectionError:
        return Response({"error":"Can't connect to AI server"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except requests.exceptions.Timeout:
        return Response({"error":"Timeout"}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Error from AI Server: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
    

@swagger_auto_schema(
    method='post',
    operation_description="Logout",
    request_body=LogoutSerializer,
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    serializer = LogoutSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    refresh_token = serializer.validated_data['refresh']
    if users_services.Black_list_token(refresh_token):
        return Response({"detail":"Logout Success"},status=status.HTTP_200_OK)
    else:
        return Response({"detail":"Token not exsit or error"},status=status.HTTP_400_BAD_REQUEST)


#Lay sua thong tin profile
@swagger_auto_schema(method='get', responses={200: UserSerializer})
@swagger_auto_schema(method='put', request_body=UserSerializer)
@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def profile_api(request):
    profile = get_object_or_404(Users, id=request.user.id)
    if request.method == 'GET':
        return Response(UserSerializer(profile).data)

    serializer = UserSerializer(profile, data = request.data, partial = True)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, 400)

#Dang Job
@swagger_auto_schema(
    method='post',
    request_body=JobSerializer,
    responses={201: JobSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(recruiter=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
    
#Sua, xoa job
@swagger_auto_schema(
    method='put',
    request_body=JobSerializer,
    responses={200: JobSerializer}
)
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_api(request, id):
    job = get_object_or_404(Jobs, id=id, recruiter=request.user)

    if request.method == 'PUT':
        serializer = JobSerializer(job, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # DELETE
    job.delete()
    return Response({"message": "Deleted"}, status=204)


    
