from . import views
from django.urls import path, include
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('user/',views.GetUserInfor),
    path('user/<str:username>/',views.GetUserbyUsername),
    path('accounts/', include('allauth.urls')),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/password/reset', PasswordResetView.as_view(), name = 'password_reset'),
    path(
        'auth/password/reset/confirm/<str:uidb64>/<str:token>',
        PasswordResetConfirmView.as_view(),
        name = 'password_reset_confirm' 
    ),
    path('analyzecv/',views.Analyze_Cv),
]