from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('user/',views.GetUserInfor),
    path('user/add/',views.AddUser),
    path('user/register/',views.UserRegister),
    path('user/<str:username>/',views.GetUserbyUsername),
    path('auth/google/', views.GoogleLoginApi),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]