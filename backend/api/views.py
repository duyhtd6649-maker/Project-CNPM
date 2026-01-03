from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from apps import users_services, cv_services
from database.models.users import Users 
from .serializers import UserSerializer, CVScanSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import json
import requests
import os

@api_view(['GET'])
def GetUserInfor(request):
    user = Users.objects.all()
    seriaizer = UserSerializer(user, many = True)
    return Response(seriaizer.data)

@api_view(['GET'])
def GetUserbyUsername(request,username):
    user = users_services.Get_User_by_username(username)
    if user == None:
        return Response({"detail":"User not found"},status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    return Response(serializer.data,status=status.HTTP_200_OK)

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


    
