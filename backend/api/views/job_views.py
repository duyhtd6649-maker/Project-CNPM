from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.job_services import JobService
from database.models.jobs import Jobs 
from ..serializers.job_serializers import JobSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import *


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
    serializer = JobSerializer(data = request.data)
    if serializer.is_valid():
        try:
            modifield_job = JobService.delete_job(user=request.user,validated_data=serializer.validated_data,job_id=id)
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