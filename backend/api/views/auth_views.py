from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from apps import users_services
from serializers.auth_serializers import LogoutSerializer, CustomTokenObtainPairSerializer
from drf_yasg.utils import swagger_auto_schema


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