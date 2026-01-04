from . import views
from .views import profile_api, create_job, job_api
from django.urls import path, include
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # ===== BUSINESS =====
    path("user/", views.GetUserInfor),
    path("user/profile/", profile_api),
    path("user/<str:username>/", views.GetUserbyUsername),
    path("recruiter/jobs/", create_job),
    path("recruiter/jobs/<int:id>/", job_api),
    path("candidate/", views.GetCandidatesInfor),
    path("banuser/", views.BanUser),
    path("removeuser/", views.RemoveUser),

    # ===== AUTH =====
    path("accounts/", include("allauth.urls")),

    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path("api/auth/jwt/login/", TokenObtainPairView.as_view()),
    path("api/auth/jwt/refresh/", TokenRefreshView.as_view()),
    path("api/auth/jwt/from-session/", views.jwt_from_session),
    path("api/auth/logout/", views.logout),
]