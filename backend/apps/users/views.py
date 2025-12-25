from django.shortcuts import render
from rest_framework import generics
from .models import User
from .serializers import UserSerializers

class UserCreate(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
