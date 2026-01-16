from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from apps.users_services import UserService, RecruiterService, AdminService, CompanyService
from database.models.users import Companies
from ..serializers.user_serializers import UserSerializer, UserProfileSerializer, CandidateSerializer, UserNameSerializer,RecruiterSerializer, CompanySerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import *

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

#Lay sua thong tin profile
@swagger_auto_schema(
    method='put',
    request_body=UserProfileSerializer,
    responses={200: UserProfileSerializer}
)
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def profile_api(request, id):
    if request.method == 'GET':
        try:
            user_instance = UserService.Get_user_profile_by_id(id)
            serializer = UserProfileSerializer(user_instance)
        except Exception as e:
            return Response({"error":f"{str(e)}"},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        serializer = UserProfileSerializer(data=request.data, partial = True)
        if serializer.is_valid():
            try:
                user_instance = UserService.update_profile(user_id=id,validated_data=serializer.validated_data)
                serializer = UserProfileSerializer(user_instance)
                return Response(serializer.data,status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
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