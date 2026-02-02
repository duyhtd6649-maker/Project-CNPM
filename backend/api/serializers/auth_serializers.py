from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from apps.users_services import UserService


class CustomRegisterSerializer(RegisterSerializer):
    ROLE_CHOICES = (
        ('recruiter', 'Recruiter'),
        ('candidate', 'Candidate'),
    )

    # ===== fields frontend đang gửi =====
    role = serializers.ChoiceField(choices=ROLE_CHOICES, required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    # giữ nguyên
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    # ===== rất quan trọng =====
    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            "phone": self.validated_data.get("phone", ""),
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
            "role": self.validated_data.get("role"),
        })
        return data

    def custom_signup(self, request, user):
        user.phone = self.validated_data.get("phone")
        user.first_name = self.validated_data.get("first_name")
        user.last_name = self.validated_data.get("last_name")
        user.fullname = f"{user.last_name} {user.first_name}".strip()
        user.role = self.validated_data.get("role")
        user.auth_provider = "LOCAL"
        user.save()

        UserService.user_signup_role(user=user, role=user.role)

    def validate(self, attrs):
        if attrs.get("password1") != attrs.get("password2"):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
