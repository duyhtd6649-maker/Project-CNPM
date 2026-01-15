from rest_framework import serializers
from database.models.users import Users,Candidates, Companies

class UserSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="company.name", read_only=True)
    class Meta:
        model = Users
        fields = ['id','username','email', 'company', 'role','is_active']

class UserNameSerializer(serializers.Serializer):
    username = serializers.CharField(required = True)

class CandidateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Candidates
        fields = ['id', 'description', 'user', 'username', 'email']

class RecruiterSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="recruiter.company.name", read_only=True)

    class Meta:
        model = Users
        fields = ['id', 'username', 'email', 'role', 'company']

class CompanySerializer(serializers.ModelSerializer):  # Serializer cho Company
    class Meta:
        model = Companies                        
        fields = ["id", "name", "description", "website", "logo_url", "address", "tax_code", "note"]