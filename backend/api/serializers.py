from rest_framework import serializers
from database.models.users import Users,Candidates
from rest_framework.validators import UniqueValidator
from dj_rest_auth.registration.serializers import RegisterSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','username','email','role']

class BanUserSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = ['id','description']

class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required = True, validators = [UniqueValidator(queryset=Users.objects.all(),message="Email already exists!")])

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

