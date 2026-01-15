from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps import users_services
from database.models.jobs import Jobs 
from serializers.job_serializers import JobSerializer
from drf_yasg.utils import swagger_auto_schema

#Dang Job
@swagger_auto_schema(
    method='post',
    request_body=JobSerializer,
    responses={201: JobSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    status_code, data = users_services.RecruiterService.create_job(request.user, request.data)
    return Response(data, status = status_code)

#Sua, xoa job
@swagger_auto_schema(
    method='put',
    request_body=JobSerializer,
    responses={200: JobSerializer}
)
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_api(request, id):
    status_code, data = users_services.RecruiterService.fix_and_delete_job(
        user = request.user,
        data = request.data,
        job_id = id,
        status = status_code,
        method = request.method
    )

@swagger_auto_schema(
    method='delete',
    responses={200: JobSerializer}
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, id):
    status_code, data = users_services.RecruiterService.delete_job(
        user=request.user,
        job_id=id
    )
    return Response(data, status=status_code)

#view job
@api_view(['GET'])
def view_job(request):
    jobs = Jobs.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)