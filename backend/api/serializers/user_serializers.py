from rest_framework import serializers
from database.models.users import Users,Candidates, Companies, Recruiters

class UserSerializer(serializers.ModelSerializer):
    company = serializers.SerializerMethodField()

    def get_company(self, obj):
        return obj.company.name if obj.company else None
        
    class Meta:
        model = Users
        fields = ['id', 'username','email', 'phone', 'company', 'role','is_active']

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(read_only = True)
    email = serializers.CharField(read_only = True)
    avatar = serializers.ImageField(required = False, source = 'avatar_url')
    class Meta:
        model = Users
        fields = ['username','email','phone','first_name','last_name','avatar']

    def validate_avatar(self, value):
        if not value.name.lower().endswith(('.png', '.jpeg', '.jpg')):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng png/jpeg.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value

class UserNameSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)

class CandidateSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required = False, allow_blank=True)
    address = serializers.CharField(required = False, allow_blank=True)
    date_of_birth = serializers.DateField(required = False, allow_null=True)
    avatar = serializers.ImageField(source="user.avatar_url", required = False)
    username = serializers.CharField(source="user.username", read_only = True)
    email =serializers.EmailField(source="user.email", read_only = True)
    phone =serializers.CharField(source="user.phone")
    first_name =serializers.CharField(source="user.first_name")
    last_name =serializers.CharField(source="user.last_name")
    class Meta:
        model = Candidates
        fields = ['username','email','phone','first_name','last_name','avatar','description','address','date_of_birth']
    def validate_avatar(self, value):
        if not value.name.lower().endswith(('.png', '.jpeg', '.jpg')):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng png/jpeg.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value

class RecruiterSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="user.company.name", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Recruiters
        fields = ['id', 'user', 'username', 'email', 'company']

class CompanySerializer(serializers.ModelSerializer):  # Serializer cho Company
    logo = serializers.ImageField(required = False)
    class Meta:
        model = Companies                        
        fields = ["id", "name", "description", "website", "logo", "address", "tax_code"]
        
    def validate_logo(self, value):
        if not value.name.lower().endswith(('.png', '.jpeg', '.jpg')):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng png/jpeg.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value

class applicationListSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    status = serializers.CharField(source="job_status", read_only=True)
    candidate_name = serializers.CharField(source="candidate.user.username", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    
    class Meta:
        fields = ['id', 'candidate_name', 'job_title', 'status', 'applied_at']

class InterviewSerializer(serializers.Serializer):
    application_id = serializers.UUIDField(required=True)
    interview_date = serializers.DateTimeField(required=True)
    location = serializers.CharField(required=True, max_length=255)
    notes = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    interviewer = serializers.CharField(required=True, max_length=255)
    application = serializers.UUIDField(required=True)

    def validate_interview_date(self, value):
        from django.utils import timezone
        if value <= timezone.now():
            raise serializers.ValidationError("The interview date must be a future date.")
        return value
    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("The location field cannot be left blank.")
        return value
    def validate_interviewer(self, value):
        if not value.strip():
            raise serializers.ValidationError("The interviewer field cannot be left blank.")
        return value
    def validate_notes(self, value):
        return value.strip()

class InterviewUpdateSerializer(serializers.Serializer):
    interview_date = serializers.DateTimeField(required=False)
    location = serializers.CharField(required=False, max_length=255)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_interview_date(self, value):
        from django.utils import timezone
        if value <= timezone.now():
            raise serializers.ValidationError("The new interview date must be a future date.")
        return value


    