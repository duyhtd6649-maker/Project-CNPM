from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from database.models.users import Users,Candidates
from database.models.jobs import Jobs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','username','email','role']

class UserNameSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','username','email','role']

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = "__all__"
        read_only_fields = ['recruiter']

class CandidateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Candidates
        fields = ['id', 'description', 'user', 'username', 'email']

class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def get_cleaned_data(self):
        return {
            "username": self.validated_data.get("username", ""),
            "email": self.validated_data.get("email", ""),
            "password1": self.validated_data.get("password1", ""),
        }

    def validate(self, attrs):
        if attrs.get("password1") != attrs.get("password2"):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class CVScanSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    targetjob = serializers.CharField(max_length=255)

    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng PDF.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value




