from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from apps.users_services import UserService, RecruiterService, AdminService, CompanyService, interviewService
from database.models.users import Companies, Recruiters, Users
from ..serializers.user_serializers import InterviewSerializer, InterviewUpdateSerializer, UserSerializer, UserProfileSerializer, CandidateSerializer, UserNameSerializer,RecruiterSerializer, CompanySerializer, applicationListSerializer
from ..serializers.job_serializers import JobSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import *
from drf_yasg import openapi



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUserProfile(request):
    try:
        instance = UserService.Get_user_profile(request.user)
        
        if request.user.role == 'candidate':
            serializer = CandidateSerializer(instance)
        elif request.user.role == 'recruiter':
            serializer = RecruiterSerializer(instance)
        else:
            serializer = UserSerializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='get',
    operation_description="Get candidate profile by ID",
    responses={200: CandidateSerializer}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetCandidateProfile(request, id):
    try:
        candidate = UserService.get_candidate_profile_by_id(candidate_id=id, user = request.user)
        serializer = CandidateSerializer(candidate)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='get',
    operation_description="Get all users' information",
    responses={200: UserSerializer(many=True)}
)
@api_view(['GET'])
def GetUserInfor(request):
    user = UserService.Get_All_User()
    serializer = UserSerializer(user, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUserInforById(request, id):
    try:
        role, instance = UserService.Get_user_profile_by_id(user_id=id)
        if role == 'candidate':
            serializer = CandidateSerializer(instance)
        elif role == 'recruiter':
            serializer = RecruiterSerializer(instance)
        else:
            serializer = UserSerializer(instance)
        return Response(serializer.data, status= status.HTTP_200_OK)
    except NotFound as e:
        return Response({f"{e}"},status= status.HTTP_404_NOT_FOUND)

@swagger_auto_schema(
    method='get',
    operation_description="Get user information by username",
    responses={200: UserSerializer}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetUserbyUsername(request,username):
    user = UserService.Get_user_profile_by_username(username)
    if user == None:
        return Response({"detail":"User not found"},status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data,status=status.HTTP_200_OK)

#Lay thong tin profile
@swagger_auto_schema(
    method='get',
    operation_description="view Profile",
    responses={200: UserProfileSerializer}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request, id):
    try:
        user_instance = UserService.Get_user_profile_by_id(id)
        serializer = UserProfileSerializer(user_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_404_NOT_FOUND)
    

#sua profile
@swagger_auto_schema(
    method='put',
    operation_description="update Profile",
    request_body=UserProfileSerializer,
    responses={200: UserProfileSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def update_profile(request, id):
    serializer = UserProfileSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        try:
            user_instance = UserService.update_profile(user_id=id, validated_data=serializer.validated_data)
            return Response(UserProfileSerializer(user_instance).data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Upload avatar",
    manual_parameters=[
        openapi.Parameter(name='avatar', in_=openapi.IN_FORM, type=openapi.TYPE_FILE, required=True, description='File jpg, png')
    ]
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_avatar(request):
    
    
    file_obj = request.FILES.get('avatar')
    
    if not file_obj:
        return Response({"error": "No avatar file selected"}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        updated_user = UserService.upload_avatar(request.user, file_obj)
        return Response({
            "message": "Avatar uploaded successfully", 
            "avatar_url": updated_user.avatar_url
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_cv(request, id):
    try:
        deleted_cv = UserService.delete_cv_of_user(user_id=request.user.id, cv_id=id)
        return Response({"detail": "CV deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_404_NOT_FOUND)
    


#Tao company
@swagger_auto_schema(
    method='post',
    request_body=CompanySerializer,
    responses={200: CompanySerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def company_create(request):
    serializer = CompanySerializer(data = request.data)
    if serializer.is_valid():
        try:
            company_instance = CompanyService.create_company(user=request.user, validated_data= serializer.validated_data)
            serializer = CompanySerializer(company_instance)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error":f"{str(e)}"},status=status.HTTP_403_FORBIDDEN)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

#view company
@api_view(['GET'])
def view_companies(request):
    companies = CompanyService.Get_all_company()
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
    try:
        company = CompanyService.delete_company(request.user,id)
        return Response({"detail":"Done"},status=status.HTTP_202_ACCEPTED)
    except Exception as e:
        return Response({"error":f"{str(e)}"},status=status.HTTP_403_FORBIDDEN)


#update company info
@swagger_auto_schema(
    method='put',
    operation_description="Update company information (Automatically retrieve the user's company)",
    request_body=CompanySerializer,
    responses={
        200: CompanySerializer,
        400: 'Input data error',
        403: 'No access permission'
    }
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_company_info(request):
    if not request.user.company:
        return Response({"This user does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
    company_id = request.user.company.id
    serializer = CompanySerializer(data=request.data, partial=True)
    if serializer.is_valid():
        try:
            updated_company = CompanyService.update_company_info(
                user=request.user, 
                company_id=company_id, 
                data=serializer.validated_data
            )
            return Response(CompanySerializer(updated_company).data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"{str(e)}"}, status=status.HTTP_403_FORBIDDEN)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_profile(request, id):
    try:
        company = CompanyService.get_company_by_id(id)
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Upload logo company",
    manual_parameters=[
        openapi.Parameter(name='logo', in_=openapi.IN_FORM, type=openapi.TYPE_FILE, required=True, description='File jpg, png')
    ]
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser]) 
def upload_company_logo(request):  
    file_obj = request.FILES.get('logo')
    
    if not file_obj:
        return Response({"error": "No logo file selected"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not request.user.company:
        return Response({"error": "This user does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
        
    company_id = request.user.company.id 

    try:
        updated_company = CompanyService.upload_logo(request.user, company_id, file_obj)
        return Response({
            "message": "Logo uploaded successfully", 
            "logo_url": updated_company.logo_url
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

#delete logo company
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_company_logo(request, id):
    try:
        CompanyService.delete_logo(request.user, id)
        return Response({"message": "Logo deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_recruiters_company(request):
    try:
        if not request.user.company:
            return Response({"error": "This user does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
        
        company_id = request.user.company.id
        recruiters = CompanyService.list_recruiters_of_company(request.user, company_id)
        serializer = RecruiterSerializer(recruiters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='delete',
    operation_description="Remove a recruiter from the company",
    responses={200: 'Recruiter removed successfully', 404: 'Not Found', 403: 'Forbidden'}
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_recruiter_from_company(request, recruiter_id):
    if not request.user.company:
        return Response({"error": "This user does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
    
    CompanyService.delete_recruiter_from_company(request.user, request.user.company.id, recruiter_id)
    
    return Response({"message": "Recruiter removed from company successfully"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_recruiter_to_company(request, recruiter_id):
    try:
        CompanyService.add_recruiter_to_company(request.user, request.user.company.id, recruiter_id)
        return Response({"message": "Recruiter added to company successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)







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
    try:
        AdminService.Ban_User(request_user= request.user, username= username)
        return Response({"detail":"banned"},status=status.HTTP_200_OK)
    except NotFound:
        return Response({"error":"User not found"},status=status.HTTP_404_NOT_FOUND)
    except PermissionDenied:
        return Response({"error":"User don't have permission"},status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    operation_description="unban",
    request_body=UserNameSerializer,
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def UnBanUser(request):
    serializer = UserNameSerializer(data = request.data)
    serializer.is_valid(raise_exception=True)
    username = serializer.validated_data['username']
    try:
        AdminService.UnBan_User(request_user= request.user, username= username)
        return Response({"detail":"banned"},status=status.HTTP_200_OK)
    except NotFound:
        return Response({"error":"User not found"},status=status.HTTP_404_NOT_FOUND)
    except PermissionDenied:
        return Response({"error":"User don't have permission"},status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    
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
    try:
        AdminService.Remove_User(request_user= request.user, username= username)
        return Response({"detail":"banned"},status=status.HTTP_200_OK)
    except NotFound:
        return Response({"error":"User not found"},status=status.HTTP_404_NOT_FOUND)
    except PermissionDenied:
        return Response({"error":"User don't have permission"},status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def GetCandidatesInfor(request):
    candidate = UserService.Get_All_Candidates()
    serializer = CandidateSerializer(candidate, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def GetRecruitersInfor(request):
    recruiters = RecruiterService.Get_All_Recruiters()
    serializer = RecruiterSerializer(recruiters, many = True)
    return Response(serializer.data)


############interview recruiter##############
@swagger_auto_schema(
    method='get',
    operation_description="List approved candidates for recruiter's jobs",
    responses={200: applicationListSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_approved_candidates(request):
    try:
        approved_applications = interviewService.get_approved_candidates(recruiter_user=request.user)
        serializer = applicationListSerializer(approved_applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PermissionDenied:
        return Response({"error": "User is not a recruiter"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method='post',
    operation_description="Create an interview for an approved candidate",
    request_body=InterviewSerializer,
    responses={201: 'Interview created successfully', 403: 'Forbidden', 404: 'Not Found', 400: 'Bad Request'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_interview(request):
    serializer = InterviewSerializer(data=request.data)
    if serializer.is_valid():
        application_id = serializer.validated_data['application_id']
        interview_date = serializer.validated_data['interview_date']
        location = serializer.validated_data['location']
        note = serializer.validated_data.get('notes', '')
        try:
            interviewService.create_interview(
                recruiter_user=request.user,
                application_id=application_id,
                interview_date=interview_date,
                location=location, 
                note=note,
            )
            return Response({"message": "Interview created successfully"}, status=status.HTTP_201_CREATED)
        except PermissionDenied:
            return Response({"error": "User is not a recruiter"}, status=status.HTTP_403_FORBIDDEN)
        except NotFound as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    operation_description="Edit an existing interview",
    request_body=InterviewUpdateSerializer, 
    responses={200: 'Interview updated successfully'}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_interview(request, interview_id):
    serializer = InterviewUpdateSerializer(data=request.data)
    
    if serializer.is_valid():
        interview_date = serializer.validated_data.get('interview_date')
        location = serializer.validated_data.get('location')
        note = serializer.validated_data.get('notes')

        try:
            interviewService.update_interview(
                recruiter_user=request.user,
                interview_id=interview_id,
                interview_date=interview_date,
                location=location,
                note=note,
            )
            return Response({"message": "Interview updated successfully"}, status=status.HTTP_200_OK)
            
        except PermissionDenied:
            return Response({"error": "User is not a recruiter"}, status=status.HTTP_403_FORBIDDEN)
        except NotFound as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method = 'get'
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def find_job_by_id(request, job_id):
    try:
        job = UserService.find_job_by_id(job_id)
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)




