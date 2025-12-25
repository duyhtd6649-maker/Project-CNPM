from django.urls import path, include
from . import views

urlpatterns = [
    path('user/', views.UserCreate.as_view(), name= "User-view-Create")
]