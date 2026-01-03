from . import views
from django.urls import path, include
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('user/',views.GetUserInfor),
    path('banuser/',views.BanUser),
    path('user/<str:username>/',views.GetUserbyUsername),
    path('candidate/',views.GetCandidatesInfor),
    path('accounts/', include('allauth.urls')),
    path('logout/',views.logout),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/password/reset', PasswordResetView.as_view(), name = 'password_reset'),
    path(
        'auth/password/reset/confirm/<str:uidb64>/<str:token>',
        PasswordResetConfirmView.as_view(),
        name = 'password_reset_confirm' 
    )
]