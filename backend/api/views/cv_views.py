from rest_framework.decorators import api_view, permission_classes,parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from apps import cv_services
from serializers.cv_serializers import CVScanSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import requests

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