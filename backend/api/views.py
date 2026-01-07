from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from apps import users_services, cv_services
from database.models.users import Users, Recruiters, Companies
from database.models.jobs import Jobs 
from .serializers import UserSerializer, CVScanSerializer, LogoutSerializer, CandidateSerializer, UserNameSerializer, JobSerializer,RecruiterSerializer, CustomTokenObtainPairSerializer, CompanySerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import json
import requests
import os
from django.shortcuts import get_object_or_404

# =============================================================================================================== #
# ==================================================== USER ===================================================== #
# =============================================================================================================== #
@api_view(['GET'])
def GetUserInfor(request):
    user = Users.objects.all()
    serializer = UserSerializer(user, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def GetUserInfor(request):
    user = Users.objects.all()
    serializer = UserSerializer(user, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUserbyUsername(request,username):
    user = users_services.Get_User_by_username(username)
    if user == None:
        return Response({"detail":"User not found"},status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data,status=status.HTTP_200_OK)

#Lay sua thong tin profile
@swagger_auto_schema(method='get', responses={200: UserSerializer})
@swagger_auto_schema(method='put', request_body=UserSerializer)
@api_view(['GET','PUT'])
@permission_classes([IsAuthenticated])
def profile_api(request):
#    profile = get_object_or_404(Users, id=request.user.id)
    user = request.user
    serializer = UserSerializer(user)
    if request.method == 'GET':
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = UserSerializer(user, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, 400)

# =============================================================================================================== #
# ================================================== CANDIDATE ================================================== #
# =============================================================================================================== #

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

    if not scanned_text or not scanned_text['raw_text']:
        return Response({"detail": "PDF is blank or unreadable"}, status=status.HTTP_400_BAD_REQUEST)
    
    cv_text_clean = scanned_text['raw_text']
    page_count = scanned_text['page_count']
    format_analysis = cv_services.analyze_format_local(cv_text_clean, page_count)

    payload = {"cvText":cv_text_clean,"targetJob":target_job}
    try:
        response = requests.post('http://localhost:8001/ai/cv/analyzer',json=payload, timeout=30)
        response.raise_for_status()
        ai_data = response.json()
    except requests.exceptions.ConnectionError:
        return Response({"error":"Can't connect to AI server"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except requests.exceptions.Timeout:
        return Response({"error":"Timeout"}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Error from AI Server: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)
    try:
        saved_result = cv_services.save_analysis_result(
            user=request.user,
            cv_file=upload_file,
            ai_result=ai_data,
            format_result=format_analysis,
            target_job = target_job
        )
    except Exception as e:
        return Response({"error": f"Failed to save analysis result to database: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    final_response = {
        "status": "success",
        "result_id": saved_result.id,
        "overall_score": saved_result.overall_score,

        "overview": {
            "file_name": upload_file.name,
            "page_count": page_count,
            "word_count": format_analysis['word_count']
        },
        "format_analysis": {
            "score": format_analysis['format_score'],
            "issues": format_analysis['contact_issues']
        },
        "content_analysis": ai_data 
    }

    return Response(final_response, status=status.HTTP_200_OK)

# =============================================================================================================== #
# ================================================== RECRUITER ================================================== #
# =============================================================================================================== #
#Dang Job
@swagger_auto_schema(
    method='post',
    request_body=JobSerializer,
    responses={201: JobSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    user = request.user

    if users_services.Is_Recruiter(user):
        if users_services.User_Have_Company(user):
            from database.models.users import Recruiters

            recruiter, _ = Recruiters.objects.get_or_create(
                user=request.user
            )

            serializer = JobSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(recruiter=recruiter)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
    else:
        return Response({"detail": "User don't have permisson"})

#Tao company
@swagger_auto_schema(
    method='post',
    request_body=JobSerializer,
    responses={200: JobSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def company_create(request, id):
    user = request.user
    recruiter = users_services.Is_Recruiter(user)   
    superuser = users_services.Is_Super_User(user)
    if not recruiter and not superuser:
        return Response({"detail": "not a recruiter"}, status=403)
    if recruiter.company is not None:
        return Response({"detail": "You already belong to a company"}, status=400)
    if request.method == 'POST':
        serializer = CompanySerializer(data = request.data)
        if serializer.is_valid():
            company = serializer.save()
            recruiter.company = company
            recruiter.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


#view company
@api_view(['GET'])
def view_companies(request):
    companies = Companies.objects.all()
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)

#delete company
@swagger_auto_schema(
    method='delete',
    responses={204: 'Company deleted successfully'}
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_companies(request, id):
    user = request.user
    recruiter = users_services.Is_Recruiter(user)
    if not recruiter:
        return Response({"detail": "is not a recruiter"}, status=403)
    else:
        company = get_object_or_404(Companies, id=id, recruiter=recruiter)
        company.delete()
        return Response({"detail": "Company deleted"}, status=status.HTTP_204_NO_CONTENT)

    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(recruiter=recruiter)
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
    user = request.user
    recruiter = users_services.Is_Recruiter(user)
    superuser = users_services.Is_Super_User(user)
    SameCompany = users_services.Same_Company(user, id)

    if not (recruiter and SameCompany) and not superuser :
        return Response({"detail": "You don't work for this company."}, status=status.HTTP_403_FORBIDDEN)
    else:
        job = get_object_or_404(Jobs, id=id)
        
        if request.method == 'PUT':

            serializer = JobSerializer(job, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # DELETE
        job.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)

#view job
@api_view(['GET'])
def view_job(request):
    jobs = Jobs.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

# =============================================================================================================== #
# ==================================================== ADMIN ==================================================== #
# =============================================================================================================== #
@swagger_auto_schema(
    method='put',
    operation_description="ban",
    request_body=UserNameSerializer,
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def BanUser(request):
    user = request.user
    if users_services.Is_Super_User(user):
        serializer = UserNameSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        if users_services.Ban_User(username):
            return Response({"detail":"Banned"},status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"detail":"User not found"},status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail":"User don't have permission"},status=status.HTTP_405_METHOD_NOT_ALLOWED)

@swagger_auto_schema(
    method='put',
    operation_description="unban",
    request_body=UserNameSerializer,
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UnBanUser(request):
    user = request.user
    if users_services.Is_Super_User(user):
        serializer = UserNameSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        if users_services.UnBan_User(username):
            return Response({"detail":"UnBanned"},status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"detail":"User not found"},status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail":"User don't have permission"},status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@swagger_auto_schema(
    method='put',
    operation_description="remove",
    request_body=UserNameSerializer,
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def RemoveUser(request):
    user = request.user
    if users_services.Is_Super_User(user):
        serializer = UserNameSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        if users_services.Remove_User(username):
            return Response({"detail":"Removed"},status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"detail":"User not found"},status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"detail":"User don't have permission"},status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
@api_view(['GET'])
def GetCandidatesInfor(request):
    candidate = users_services.Get_All_Candidates()
    serializer = CandidateSerializer(candidate, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def GetRecruitersInfor(request):
    recruiters = users_services.Get_All_Recruiters()
    serializer = RecruiterSerializer(recruiters, many = True)
    return Response(serializer.data)

# =============================================================================================================== #
# =============================================== LOGIN / SIGNUP ================================================ #
# =============================================================================================================== #
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def jwt_from_session(request):
    refresh = RefreshToken.for_user(request.user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": request.user.role,
    })
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
