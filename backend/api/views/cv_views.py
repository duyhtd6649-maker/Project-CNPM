from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from apps import cv_services
from ..serializers.cv_serializers import CVScanSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

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
    try:
        data = cv_services.analyze_cv(validated_data=serializer.validated_data,user=request.user)
    except Exception as e:
        return Response({"error": f"{str(e)}"},status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Response(data,status= status.HTTP_200_OK)