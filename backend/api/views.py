from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps import users_services
from database.models.users import Users 
from .serializers import UserSerializer

@api_view(['GET'])
def GetUserInfor(request):
    return Response(UserSerializer().data)