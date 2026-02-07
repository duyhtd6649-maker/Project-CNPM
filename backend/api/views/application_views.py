from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from apps.application_services import ApplicationService
from ..serializers.application_serializers import ApplicationSerializer, ApplicationSystemStatusUpdateSerializer, ApplicationJobStatusUpdateSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import *
from drf_yasg import openapi

@swagger_auto_schema(
    method='post',
    request_body=ApplicationSerializer,
    responses={201: ApplicationSerializer}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job(request,id):
    serializer = ApplicationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            application = ApplicationService.apply_job(user=request.user,job_id=id,cvsid=serializer.validated_data.get('cvsid'))
            response_serializer = ApplicationSerializer(application)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except PermissionDenied:
            return Response({"error": "User doesn't have permission"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_application(request, id):
    try:
        ApplicationService.delete_application(user=request.user, id=id)
        return Response({"message": "Application deleted successfully."}, status=status.HTTP_200_OK)
    except PermissionDenied:
        return Response({"error": "User doesn't have permission"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
filter_params = [
    openapi.Parameter(
        'company_id', 
        openapi.IN_QUERY, 
        description="Lọc theo ID công ty (Optional)", 
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'job_status', 
        openapi.IN_QUERY, 
        description="Lọc theo trạng thái (Pending, Approved...)", 
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'job_title', 
        openapi.IN_QUERY, 
        description="Tìm kiếm theo tên công việc", 
        type=openapi.TYPE_STRING
    ),
]
@swagger_auto_schema(
    method='get', 
    manual_parameters=filter_params,
    responses={200: ApplicationSerializer(many=True)}
)    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def applications_of_recruiter(request):
    try:
        queryset = ApplicationService.get_applications(user = request.user, filters=request.query_params)
        serializer = ApplicationSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PermissionDenied:
        return Response({"error": "User doesn't have permission"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def applications_of_user(request):
    try:
        applications = ApplicationService.get_applications_of_user(user = request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def application_by_id(request,id):
    try:
        application = ApplicationService.get_application_by_id(user=request.user,application_id=id)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PermissionDenied:
        return Response({"error": "User doesn't have permission"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

filter_params = [
    openapi.Parameter(
        'company_name', 
        openapi.IN_QUERY, 
        description="Lọc theo tên công ty (Optional)", 
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'system_status', 
        openapi.IN_QUERY, 
        description="Lọc theo trạng thái (Pending, Approved...)", 
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'job_title', 
        openapi.IN_QUERY, 
        description="Tìm kiếm theo tên công việc", 
        type=openapi.TYPE_STRING
    ),
]
@swagger_auto_schema(
    method='get', 
    manual_parameters=filter_params,
    responses={200: ApplicationSerializer(many=True)}
)    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def applications(request):
    try:
        queryset = ApplicationService.get_application_by_filters(user = request.user, filters=request.query_params)
        serializer = ApplicationSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PermissionDenied:
        return Response({"error": "User doesn't have permission"}, status=status.HTTP_403_FORBIDDEN)
    
@swagger_auto_schema(
    method='put',
    request_body=ApplicationSystemStatusUpdateSerializer,
    responses={200: ApplicationSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_application_system_status(request, id):
    serializer = ApplicationSystemStatusUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        new_status = serializer.validated_data.get('new_status')
        application = ApplicationService.update_application_system_status(user=request.user, application_id=id, new_status=new_status)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PermissionDenied:
        return Response({"error": "User doesn't have permission"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='put',
    request_body=ApplicationJobStatusUpdateSerializer,
    responses={200: ApplicationSerializer}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_application_job_status(request, id):
    serializer = ApplicationJobStatusUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        new_status = serializer.validated_data.get('new_status')
        application = ApplicationService.update_application_job_status(user=request.user, application_id=id, new_status=new_status)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except PermissionDenied:
        return Response({"error": "User doesn't have permission"}, status=status.HTTP_403_FORBIDDEN)
    except Exception as e:
        return Response({"error": f"{str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    

