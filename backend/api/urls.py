from . import views
from .views import profile_api, create_job, job_api, view_job,CustomTokenObtainPairView
from django.urls import path, include
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # ===== USER =====
    path('user/',views.GetUserInfor),
    path('user/profile/', profile_api),
    path('views/viewjobs/', view_job),
    path('user/<str:username>/',views.GetUserbyUsername),
    # ===== CANDIDATE =====
    path('candidate/cvanalyzer/',views.Analyze_Cv),
    # ===== RECRUITER =====
    path('recruiter/jobs/', create_job),
    path('recruiter/jobs/<uuid:id>/', job_api),
    # ===== ADMIN =====
    path('admin/banuser/',views.BanUser),
    path('admin/unbanuser/',views.UnBanUser),
    path('admin/removeuser/',views.RemoveUser),
    path('admin/viewcandidateslist/',views.GetCandidatesInfor),
    path('admin/viewrecruiterslist/',views.GetRecruitersInfor),
    # ===== AUTH =====
    path("accounts/", include("allauth.urls")),
    # ===== LOGIN / SIGNUP =====
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/jwt/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("api/auth/jwt/refresh/", TokenRefreshView.as_view()),
    path("api/auth/jwt/from-session/", views.jwt_from_session),
    path("api/auth/logout/", views.logout),
]