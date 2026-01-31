from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from apps.users_services import UserService, RecruiterService, AdminService, CompanyService
from database.models.users import Companies, Recruiters, Users
from ..serializers.user_serializers import UserSerializer, UserProfileSerializer, CandidateSerializer, UserNameSerializer,RecruiterSerializer, CompanySerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import *
from drf_yasg import openapi

@api_view(['GET'])
def GetUserInfor(request):
    user = UserService.Get_All_User()
    serializer = UserSerializer(user, many = True)
    return Response(serializer.data)

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
    operation_description="Xem thông tin Profile",
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
    operation_description="Cập nhật Profile",
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
        openapi.Parameter(name='logo', in_=openapi.IN_FORM, type=openapi.TYPE_FILE, required=True, description='File ảnh logo')
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
    # 1. Check cơ bản
    if not request.user.company:
        return Response({"error": "This user does not belong to any company"}, status=status.HTTP_400_BAD_REQUEST)
    
    # 2. Gọi Service
    # Không cần try-except bọc ngoài cùng nữa, để DRF tự bắt lỗi 404/403
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