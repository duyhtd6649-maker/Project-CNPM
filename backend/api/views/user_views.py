from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from apps import users_services
from database.models.users import Companies
from serializers.user_serializers import UserSerializer, CandidateSerializer, UserNameSerializer,RecruiterSerializer, CompanySerializer
from drf_yasg.utils import swagger_auto_schema



# =============================================================================================================== #
# ==================================================== USER ===================================================== #
# =============================================================================================================== #
@api_view(['GET'])
def GetUserInfor(request):
    user = users_services.Get_User_Info()
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
    if request.method == 'GET':
        return Response(users_services.UserServices.get_profile(request.user))
    if request.method == 'PUT':
        return Response(users_services.UserServices.update_profile(request.user, request.data))
    
#Tao company
@swagger_auto_schema(
    method='post',
    request_body=CompanySerializer,
    responses={200: CompanySerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def company_create(request):
    status_code, data = users_services.RecruiterService.create_company(request.user, request.data)
    return Response(data, status = status_code)

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
    status_code, data = users_services.RecruiterService.delete_company(request.user, id)
    return Response(data, status= status_code)

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