from django.urls import path, include
from . import views

urlpatterns = [
    path('user/',views.GetUserInfor),
    path('user/add',views.AddUser),
    path('user/register',views.UserRegister)
]