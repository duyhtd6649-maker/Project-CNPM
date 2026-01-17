from .views import user_views, ai_views, auth_views, cv_views, job_views
from django.urls import path, include
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # ===== USER =====
    path('user/',user_views.GetUserInfor),
    path('user/profile/<uuid:id>', user_views.profile_api),
    path('views/viewjobs/', job_views.view_job),
    path('views/viewcompanies/', user_views.view_companies),
    path('user/<str:username>/',user_views.GetUserbyUsername),
    # ===== CANDIDATE =====
    path('candidate/cvanalyzer/',cv_views.Analyze_Cv),
    # ===== RECRUITER =====
    path('recruiter/jobs/', job_views.create_job),
    path('recruiter/jobs/<uuid:id>/', job_views.update_job),
    path('recruiter/company/<uuid:id>/', user_views.delete_companies),
    path('recruiter/conpany_create', user_views.company_create),
    path("recruiter/jobs/delete/<uuid:id>/", job_views.delete_job),
    # ===== ADMIN =====
    path('admin/banuser/',user_views.BanUser),
    path('admin/unbanuser/',user_views.UnBanUser),
    path('admin/removeuser/',user_views.RemoveUser),
    path('admin/viewcandidateslist/',user_views.GetCandidatesInfor),
    path('admin/viewrecruiterslist/',user_views.GetRecruitersInfor),
    # ===== AUTH =====
    path("accounts/", include("allauth.urls")),
    # ===== LOGIN / SIGNUP =====
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/jwt/login/', auth_views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("api/auth/jwt/refresh/", TokenRefreshView.as_view()),
    path("api/auth/jwt/from-session/", auth_views.jwt_from_session),
    path("api/auth/logout/", auth_views.logout),
    # ===== AI =====
    path("ai/career/coach", ai_views.CareerCoachAPIView.as_view()),
    path("ai/cv/analyzer", ai_views.CvAnalyzerAPIView.as_view()),
    
]