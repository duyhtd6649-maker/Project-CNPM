from database.models.services import Refreshtokens
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.utils import timezone

def create_refresh_token_record(user, refresh_token_string, request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    ip_address = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    expires_in = settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME')
    Refreshtokens.objects.create(
        user=user,
        token=refresh_token_string,
        expires=timezone.now() + expires_in,
        ip_address=ip_address,
        user_agent=user_agent,
        is_revoked=False
    )

def revoke_refresh_token(refresh_token_string):
    try:
        token_recorded = Refreshtokens.objects.get(token = refresh_token_string)
        token_recorded.is_revoked = True
        token_recorded.save()
        return True
    except Refreshtokens.DoesNotExist:
        return False

def validate_token_in_db(refresh_token_string):
    try:
        token_recorded = Refreshtokens.objects.get(token = refresh_token_string)
        if token_recorded.is_revoked:
            raise AuthenticationFailed("Refresh token is revoked")
        if token_recorded.user.is_active == False:
            raise AuthenticationFailed("User is banned")
        if token_recorded.expires < timezone.now():
            raise AuthenticationFailed("Refresh token expires")
        return token_recorded
    except Refreshtokens.DoesNotExist:
        raise AuthenticationFailed("Token is not exist")
