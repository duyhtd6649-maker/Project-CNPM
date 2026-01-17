from rest_framework import serializers
from database.models.users import Users,Candidates, Companies, Recruiters

class UserSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="company.name", read_only=True)
    class Meta:
        model = Users
        fields = ['username','email', 'company', 'role','is_active']

class UserProfileSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="company.name", read_only=True)
    role = serializers.CharField(read_only = True)
    username = serializers.CharField(read_only = True)
    email = serializers.CharField(read_only = True)
    avatar = serializers.ImageField(required = False)
    class Meta:
        model = Users
        fields = ['username','email', 'company', 'role','phone','first_name','last_name','avatar']

    def validate_avatar(self, value):
        if not value.name.lower().endswith(('.png', '.jpeg', '.jpg')):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng png/jpeg.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value

class UserNameSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)

class CandidateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Candidates
        fields = ['id', 'description', 'user', 'username', 'email']

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
        fields = ["id", "name", "description", "website", "logo", "address", "tax_code", "note"]
    def validate_logo(self, value):
        if not value.name.lower().endswith(('.png', '.jpeg', '.jpg')):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng png/jpeg.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value