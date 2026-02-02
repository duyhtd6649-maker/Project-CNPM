from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from apps import cv_services
from ..serializers.cv_serializers import CVScanSerializer,CVSerializer, CVListSerializer,AnalysisSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import *
from database.models.CV import Cvs


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


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def Delete_Cv(request, id):
    try:
        cv = Cvs.objects.get(id=id)
        cv.delete()
        return Response({"message": "CV deleted successfully."}, status=status.HTTP_200_OK)
    except Cvs.DoesNotExist:
        return Response({"error": "CV not found."}, status=status.HTTP_404_NOT_FOUND)
    

@swagger_auto_schema(
    method='post',
    operation_description="Upload CV PDF",
    manual_parameters=[
        openapi.Parameter(
            name='file',
            in_=openapi.IN_FORM,
            type=openapi.TYPE_FILE,
            required=True,
            description='File PDF CV'
        ),
    ],
    responses={200: 'Kết quả phân tích JSON', 400: 'Lỗi dữ liệu'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def Upload_Cv(request):
    serializer = CVSerializer(data=request.data)
    if serializer.is_valid():
        try:
            new_cv = cv_services.upload_cv(user=request.user, validated_data= serializer.validated_data)
            serializer = CVSerializer(new_cv)
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cv_detail(request, id):
    try:
        cv = cv_services.cv_detail(cv_id = id)
        serializer = CVSerializer(cv)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({f"{e}"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cv_list(request):
    try:
        cv = cv_services.cv_list(user = request.user)
        serializer = CVListSerializer(cv, many = True)
        return Response(serializer.data, status= status.HTTP_302_FOUND)
    except PermissionError as e:
        return Response({f"{e}"},status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cv_analysis_detail(request, id):
    try:
        anaylysis_result = cv_services.analysis_detail(analysis_id = id)
        return Response(anaylysis_result, status= status.HTTP_200_OK)
    except NotFound as e:
        return Response({f"{e}"},status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({f"{e}"},status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cv_analysis_list(request, id):
    try:
        analysis_list = cv_services.analysis_list(user = request.user, cv_id = id)
        serializer = AnalysisSerializer(analysis_list, many = True)
        return Response(serializer.data, status=status.HTTP_302_FOUND)
    except PermissionError as e:
        return Response({f"{e}"},status=status.HTTP_403_FORBIDDEN)
