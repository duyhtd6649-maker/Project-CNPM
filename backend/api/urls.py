from .views import user_views, ai_views, auth_views, cv_views, job_views
from django.urls import path, include
from rest_framework.views import APIView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api.views.ai_views import mock_interview

urlpatterns = [
    # ===== USER =====
    path('user/',user_views.GetUserInfor),
    path('user/profile/<uuid:id>', user_views.profile_view),
    path('user/profile/update/<uuid:id>', user_views.update_profile),
    path('views/viewjobs/', job_views.view_job),
    path('views/viewcompanies/', user_views.view_companies),
    path('user/<str:username>/',user_views.GetUserbyUsername),
    # ===== CANDIDATE =====
    path('candidate/cvanalyzer/',cv_views.Analyze_Cv),
    path('candidate/search/', job_views.search_jobs),
    # ===== RECRUITER =====
    path('recruiter/jobs/', job_views.create_job),
    path('recruiter/jobs/<uuid:id>/', job_views.update_job),
    path('recruiter/jobs/delete/<uuid:id>/', job_views.delete_job),
    path('recruiter/company/<uuid:id>/', user_views.delete_companies),
    path('recruiter/conpany_create', user_views.company_create),
    path('recruiter/company/update_logo/', user_views.upload_company_logo),
    path('recruiter/company_update/info/', user_views.update_company_info),
    path('recruiter/company/<str:id>/delete_logo/', user_views.delete_company_logo),
    path('recruiter/delete_recruiter_from_company/<uuid:recruiter_id>/', user_views.delete_recruiter_from_company),
    path('recruiter/recruiters_of_company/',user_views.list_recruiters_company),
    path('recruiter/add_recruiter_to_company/<uuid:recruiter_id>/',user_views.add_recruiter_to_company),
    # ===== ADMIN =====
    path('admin/banuser/',user_views.BanUser),
    path('admin/unbanuser/',user_views.UnBanUser),
    path('admin/removeuser/',user_views.RemoveUser),
    path('admin/viewcandidateslist/',user_views.GetCandidatesInfor),
    path('admin/viewrecruiterslist/',user_views.GetRecruitersInfor),
    path('admin/deletecv/<uuid:id>/',cv_views.Delete_Cv),
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
    path("ai/mock-interview/", mock_interview)
]