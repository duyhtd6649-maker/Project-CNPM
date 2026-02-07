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
    path('user/candidate/<uuid:id>/', user_views.GetCandidateProfile),
    path('user/<uuid:id>/', user_views.GetUserInforById),
    path('candidate/profile', user_views.update_candidate_profile), #update profile cho candidate
    path('user/profile/myprofile', user_views.view_my_profile), #xem profile của mình
    path('user/company/profile', user_views.view_user_company_profile), #xem profile công ty của mình
    # ===== CV =====
    path('cv/analyzer/',cv_views.Analyze_Cv), #upload và phân tích cv
    path('cv/upload/', cv_views.Upload_Cv), #phân tích cv
    path('cv/<uuid:id>/delete/',cv_views.Delete_Cv), #xóa cv
    path('cv/<uuid:id>/',cv_views.cv_detail), #xem chi tiet cv
    path('cv/list/',cv_views.cv_list), #Xem danh sách cv của mình
    path('cv/analysisresult/<uuid:id>/',cv_views.cv_analysis_detail), #Xem chi tiết 1 bản phân tích của 1 cv
    path('cv/<uuid:id>/analysisresult',cv_views.cv_analysis_list), #Xem danh sách các bản phân tích của cv
    
    # ===== JOB =====
    path('job/create', job_views.create_job), #tạo job
    path('job/<uuid:id>/view/', job_views.view_job_detail), #xem chi tiết job
    path('job/<uuid:id>/update', job_views.update_job), #update job
    path('job/<uuid:id>/apply/', application_views.apply_job), #apply job
    path('search/job/', job_views.search_jobs), #tìm job có filter
    path('job/<uuid:id>/delete/', job_views.delete_job), #xóa job
    path('job/recommended/', job_views.recommended_jobs), #recommendation job
    path('job/<uuid:id>/close/', job_views.close_job), #đóng job
    path('job/processjob/<uuid:id>/',job_views.process_job),
    # ===== COMPANY =====
    path('company/<uuid:id>/', user_views.company_detail), #lấy detail của 1 company
    path('search/company/',user_views.search_company), #search company có filter
    path('company/<uuid:id>/delete/', user_views.delete_companies), #xóa company 
    path('company/create/', user_views.company_create), #tạo company
    path('company/update/logo/', user_views.upload_company_logo), #update logo của company
    path('company/update/info/', user_views.update_company_info), #update thông tin của company
    path('company/<str:id>/delete_logo/', user_views.delete_company_logo), #xóa logo của company
    # ===== APPLICATION =====    
    #path('applications/<uuid:id>/delete/', application_views.delete_application), #xóa application
    path('applications/<uuid:id>/UpdateStatus/', application_views.update_application_system_status), #update application status
    path('applications/search/', application_views.applications), #tìm application có filter
    path('applications/<uuid:id>/', application_views.application_by_id), #xem application
    path('recruiter/jobs/',job_views.jobs_of_recruiter), #filter lấy về các job của recruiter
    path('recruiter/applications/', application_views.applications_of_recruiter),
    path('recruiter/applications/<uuid:id>/UpdateStatus/', application_views.update_application_job_status), #recruiter update status của application
    path('user/<uuid:id>/applications/', application_views.applications_of_user), #candidate tự xem application
    path('user/profile/<uuid:id>', user_views.profile_view),
    path('user/profile/update/<uuid:id>', user_views.update_profile), #update profile cho admin, recruiter
    # ===== RECRUITER =====
    path('recruiter/delete_recruiter_from_company/<uuid:recruiter_id>/', user_views.delete_recruiter_from_company), #xóa 1 recruiter khỏi company
    path('recruiter/recruiters_of_company/',user_views.list_recruiters_company), #xem tất cả recruiter của company đó
    path('recruiter/add_recruiter_to_company/<uuid:recruiter_id>/',user_views.add_recruiter_to_company), #thêm 1 recruiter vào company
    path('recruiter/approved_candidates/', user_views.list_approved_candidates),
    path('recruiter/create_interview/', user_views.create_interview), #tạo cuộc phỏng vấn
    path('recruiter/interviews/update/<uuid:interview_id>/', user_views.update_interview), #cập nhật thông tin phỏng vấn (ngày, địa điểm, note)
    # ===== ADMIN =====
    path('banuser/',user_views.BanUser), #ban user
    path('unbanuser/',user_views.UnBanUser), #unban user
    path('removeuser/',user_views.RemoveUser), #xóa user
    path('candidates/',user_views.GetCandidatesInfor),
    path('recruiters/',user_views.GetRecruitersInfor),
    path('admins/dashboard/', user_views.admin_dashboard_stats), #dashboard cho admin
    # ===== AUTH =====
    path("accounts/", include("allauth.urls")),
    # ===== LOGIN / SIGNUP =====
    path('auth/registration/', include('dj_rest_auth.registration.urls')), #dki
    path('auth/jwt/login/', auth_views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), #dang nhap
    path("auth/jwt/refresh/", TokenRefreshView.as_view()), #tao lai access token moi
    path("auth/jwt/from-session/", auth_views.jwt_from_session),
    path("auth/logout/", auth_views.logout), #logout
    # ===== AI =====
    path("ai/career/coach", ai_views.CareerCoachAPIView.as_view()),
    path("ai/cv/analyzer", ai_views.CvAnalyzerAPIView.as_view()),
    path("ai/mock-interview/", mock_interview),


    path("notification", user_views.notification),
]
