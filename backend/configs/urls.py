from django.contrib import admin
from django.urls import path, include
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('', include('api.urls')),
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
]
