from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from apps.job_services import JobService
from ..serializers.job_serializers import JobSerializer,JobForFilterSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import *
from drf_yasg import openapi


#Dang Job
@swagger_auto_schema(
    method='post',
    request_body=JobSerializer,
    responses={201: JobSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    serializer = JobSerializer(data= request.data)
    if serializer.is_valid():
        try:
            new_job = JobService.create_job(user=request.user, validated_data= serializer.validated_data)
            serializer = JobSerializer(new_job)
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        except PermissionDenied:
            return Response({"error":"User don't have permission"},status= status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)

#Sua, xoa job
@swagger_auto_schema(
    method='put',
    request_body=JobSerializer,
    responses={200: JobSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_job(request, id):
    serializer = JobSerializer(data = request.data)
    if serializer.is_valid():
        try:
            modifield_job = JobService.update_job(user=request.user,validated_data=serializer.validated_data,job_id=id)
            serializer = JobSerializer(modifield_job)
            return Response(serializer.data, status= status.HTTP_201_CREATED)
        except PermissionDenied:
            return Response({"error":"User don't have permission"},status= status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='delete',
    responses={200: JobSerializer}
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, id):
    try:
        modifield_job = JobService.delete_job(user=request.user,job_id=id)
        serializer = JobSerializer(modifield_job)
        return Response(serializer.data, status= status.HTTP_201_CREATED)
    except PermissionDenied:
        return Response({"error":"User don't have permission"},status= status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error":f"{str(e)}"},status=status.HTTP_400_BAD_REQUEST) 

#view job
@api_view(['GET'])
def view_job(request):
    jobs = JobService.Get_all_job()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)

@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter(
            'title',
            openapi.IN_QUERY,
            description="Từ khóa tìm kiếm",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'location',
            openapi.IN_QUERY,
            description="Địa điểm",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'category',
            openapi.IN_QUERY,
            description="Loại công việc",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'description',
            openapi.IN_QUERY,
            description="Mô tả công việc",
            type=openapi.TYPE_STRING,
            required=False
        ),
        openapi.Parameter(
            'Skill',
            openapi.IN_QUERY,
            description="Kỹ năng yêu cầu",
            type=openapi.TYPE_ARRAY,
            items=openapi.Items(type=openapi.TYPE_STRING), 
            collectionFormat='multi',
            required=False
        ),
        openapi.Parameter(
            'Company',
            openapi.IN_QUERY,
            description="Công ty",
            type=openapi.TYPE_STRING,
            required=False
        ),
    ],
    responses={200: JobSerializer(many=True)}
)
@api_view(['GET'])  # Thử đổi sang GET xem
@permission_classes([IsAuthenticated])
def search_jobs(request):
    try:
        jobs = JobService.search_jobs(filters = request.query_params)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def jobs_of_recruiter(request):
    try:
        filters = JobService.Get_job(user=request.user)
        serializer = JobForFilterSerializer(filters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_jobs(request):
    try:
        jobs = JobService.get_recommended_jobs(user=request.user)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    responses={200: JobSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def close_job(request, id):
    try:
        job = JobService.close_job(user=request.user, job_id= id)
        return Response({"detail":"success"}, status=status.HTTP_200_OK)
    except NotFound:
        return Response({"detail":"Job not found"}, status=status.HTTP_404_NOT_FOUND)
    

@swagger_auto_schema(
    method = 'get'
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_job_detail(request, id):
    try:
        job = JobService.view_job_detail(id)
        serializer = JobSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except NotFound as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

