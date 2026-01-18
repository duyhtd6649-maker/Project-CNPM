# chatbot/urls.py
from django.urls import path
from .views import mock_interview_chat

urlpatterns = [
    path("mock-interview/", mock_interview_chat),
]
