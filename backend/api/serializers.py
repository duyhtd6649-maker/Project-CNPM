from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from database.models.users import Users,Candidates, Companies
from database.models.jobs import Jobs

# ===== USER =====
class UserSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="company.name", read_only=True)
    class Meta:
        model = Users
        fields = ['id','username','email', 'company', 'role','is_active']

class UserNameSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)

# ===== CANDIDATE =====
class CandidateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Candidates
        fields = ['id', 'description', 'user', 'username', 'email']
        
class CVScanSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    targetjob = serializers.CharField(max_length=255)

    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng PDF.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value

# ===== RECRUITER =====
class RecruiterSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="recruiter.company.name", read_only=True)

    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'role', 'company']

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = ['id', 'title', 'description', 'location', 'skill', 'salary_min', 'salary_max']

class CompanySerializer(serializers.ModelSerializer):  # Serializer cho Company
    class Meta:
        model = Companies                        
        fields = ["id", "name", "description", "website", "logo_url", "address", "tax_code", "note"]

# ===== LOGIN / SIGNUP =====
class CustomRegisterSerializer(RegisterSerializer):
    ROLE_CHOICES = (
        ('recruiter', 'Recruiter'),
        ('candidate', 'Candidate'),
    )
    role = serializers.ChoiceField(choices=ROLE_CHOICES, required=True)
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    def custom_signup(self, request, user):
        role = self.validated_data.get('role')
        user.role = role 
        user.save()
        if role == 'candidate':
            Candidates.objects.create(user=user)

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

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role 

        return data
    
class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    
class CareerCoachRequestSerializer(serializers.Serializer):
    question = serializers.CharField()


class CareerCoachResponseSerializer(serializers.Serializer):
    expectedCareer = serializers.ListField(child=serializers.CharField())
    overview = serializers.ListField(child=serializers.CharField())
    skills = serializers.ListField(child=serializers.CharField())
    learningPaths = serializers.ListField(child=serializers.CharField())


class CvAnalyzerRequestSerializer(serializers.Serializer):
    cvText = serializers.CharField()
    targetJob = serializers.CharField()






