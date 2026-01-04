from . import views
from .views import profile_api, create_job, job_api, view_job
from django.urls import path, include
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('user/',views.GetUserInfor),
    path('user/profile/', profile_api),
    path('recruiter/jobs/', create_job),
    path('recruiter/jobs/<uuid:id>/', job_api),
    path('views/viewjobs/', view_job),
    path('banuser/',views.BanUser),
    path('removeuser/',views.RemoveUser),
    path('user/<str:username>/',views.GetUserbyUsername),
    path('candidate/',views.GetCandidatesInfor),

    # OAuth
    path('accounts/', include('allauth.urls')),

    # JWT
    path('api/auth/jwt/login/', TokenObtainPairView.as_view()),
    path('api/auth/jwt/refresh/', TokenRefreshView.as_view()),
]