from .views import user_views, ai_views, auth_views, cv_views, job_views, application_views
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
    path('user/<str:username>/',user_views.GetUserbyUsername),
    path('user/candidate/<uuid:id>/', user_views.GetCandidateProfile),
    path('user/<uuid:id>/', user_views.GetUserInforById),
    # ===== CV =====
    path('cv/analyzer/',cv_views.Analyze_Cv),
    path('cv/upload/', cv_views.Upload_Cv),
    path('cv/<uuid:id>/delete/',cv_views.Delete_Cv),
    # ===== JOB =====
    path('job/viewjobs/', job_views.view_job),
    path('job/create', job_views.create_job),
    path('job/<uuid:id>/update', job_views.update_job),
    path('job/<uuid:id>/apply/', application_views.apply_job),
    path('job/search/', job_views.search_jobs),
    path('job/<uuid:id>/delete/', job_views.delete_job),
    path('job/recommended/', job_views.recommended_jobs),
    # ===== COMPANY =====
    path('company/viewcompanies/', user_views.view_companies),
    path('company/<uuid:id>/delete/', user_views.delete_companies),
    path('company/create/', user_views.company_create),
    path('company/update/logo/', user_views.upload_company_logo),
    path('company/update/info/', user_views.update_company_info),
    path('company/<str:id>/delete_logo/', user_views.delete_company_logo),
    # ===== APPLICATION =====    
    path('applications/<uuid:id>/delete/', application_views.delete_application),
    path('applications/<uuid:id>/UpdateStatus/', application_views.update_application_system_status),
    path('applications/', application_views.applications),
    path('applications/<uuid:id>/', application_views.application_by_id),
    path('recruiter/jobs/',job_views.jobs_of_recruiter),
    path('recruiter/applications/', application_views.applications_of_recruiter),
    path('recruiter/applications/<uuid:id>/UpdateStatus/', application_views.update_application_job_status),
    path('user/<uuid:id>/applications/', application_views.applications_of_user),
    path('user/profile/<uuid:id>', user_views.profile_view),
    path('user/profile/update/<uuid:id>', user_views.update_profile),
    path('user/upload_avatar/', user_views.upload_avatar),
    path('views/viewjobs/', job_views.view_job),
    path('views/viewcompanies/', user_views.view_companies),
    path('user/<str:username>/',user_views.GetUserbyUsername),
    # ===== RECRUITER =====
    path('recruiter/delete_recruiter_from_company/<uuid:recruiter_id>/', user_views.delete_recruiter_from_company),
    path('recruiter/recruiters_of_company/',user_views.list_recruiters_company),
    path('recruiter/add_recruiter_to_company/<uuid:recruiter_id>/',user_views.add_recruiter_to_company),
    path('recruiter/approved_candidates/', user_views.list_approved_candidates),
    path('recruiter/create_interview/', user_views.create_interview),
    path('recruiter/interviews/update/<uuid:interview_id>/', user_views.update_interview),
    # ===== ADMIN =====
    path('banuser/',user_views.BanUser),
    path('unbanuser/',user_views.UnBanUser),
    path('removeuser/',user_views.RemoveUser),
    path('candidates/',user_views.GetCandidatesInfor),
    path('recruiters/',user_views.GetRecruitersInfor),
    # ===== AUTH =====
    path("accounts/", include("allauth.urls")),
    # ===== LOGIN / SIGNUP =====
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/jwt/login/', auth_views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("auth/jwt/refresh/", TokenRefreshView.as_view()),
    path("auth/jwt/from-session/", auth_views.jwt_from_session),
    path("auth/logout/", auth_views.logout),
    # ===== AI =====
    path("ai/career/coach", ai_views.CareerCoachAPIView.as_view()),
    path("ai/cv/analyzer", ai_views.CvAnalyzerAPIView.as_view()),
    path("ai/mock-interview/", mock_interview),
]