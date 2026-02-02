"""
Django settings for backend project.
"""

from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta
import os
import pymysql

pymysql.install_as_MySQLdb()

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR.parent / '.env')
load_dotenv(BASE_DIR / ".env")

SECRET_KEY = 'django-insecure-st9rt#=j8%!wx$ciokbn%n4@))xjl4oukt$&a)1vfjz7d#+kri'

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# ================= APPLICATIONS =================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    'corsheaders',

    'apps',
    'api',
    'database.apps.DatabaseConfig',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',

    'dj_rest_auth',
    'dj_rest_auth.registration',

    'drf_yasg',
]

SITE_ID = 1


# ================= MIDDLEWARE =================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]


# ================= URL / WSGI =================

ROOT_URLCONF = 'configs.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'configs.wsgi.application'


# ================= DATABASE =================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'careermatedb'),
        'USER': os.getenv('DB_USER', 'root'),
        'PASSWORD': os.getenv('DB_PASSWORD', '1234'),
        'HOST': os.getenv('DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}


# ================= PASSWORD VALIDATION =================

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ================= I18N =================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ================= STATIC / MEDIA =================

STATIC_URL = 'static/'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# ================= CORS =================

CORS_ALLOW_ALL_ORIGINS = True


# ================= AUTH =================

AUTH_USER_MODEL = 'database.Users'

LOGIN_REDIRECT_URL = "/swagger/"
LOGOUT_REDIRECT_URL = "/swagger/"
SIGNUP_REDIRECT_URL = "/swagger/"

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)


# ================= ALLAUTH =================

ACCOUNT_LOGIN_METHODS = {'username'}
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_VERIFICATION = 'none'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_REQUIRED = True

ACCOUNT_SIGNUP_FIELDS = {
    'email': {'required': True},
    'username': {'required': True},
    'password1': {'required': True},
    'password2': {'required': True},
}


# ================= EMAIL =================

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'livewallpaper2907@gmail.com'
EMAIL_HOST_PASSWORD = 'bfnp rmuq iyjc hkyk'
DEFAULT_FROM_EMAIL = 'livewallpaper2907@gmail.com'


# ================= REST FRAMEWORK =================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}


# ================= DJ-REST-AUTH (🔥 SỬA ĐÚNG Ở ĐÂY 🔥) =================

REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_HTTPONLY": False,
    "JWT_AUTH_COOKIE": 'core-app-auth',
    "JWT_AUTH_REFRESH_COOKIE": 'core-refresh-token',
}

# ✅ BẮT BUỘC phải để RIÊNG – không nằm trong REST_AUTH
REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'api.serializers.auth_serializers.CustomRegisterSerializer',
}


# ================= JWT =================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=10),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}


# ================= SWAGGER =================

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        "Bearer": {
            "type": "apikey",
            "name": "Authorization",
            "in": "header",
        }
    }
}
