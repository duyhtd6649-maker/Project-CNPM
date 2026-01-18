from rest_framework import serializers
from database.models.jobs import Jobs

class JobSerializer(serializers.ModelSerializer):
    isdeleted = serializers.BooleanField(read_only = True)
    company = serializers.CharField(source="company.name", read_only=True)
    class Meta:
        model = Jobs
        fields = ['id', 'company', 'title', 'description', 'location', 'skill', 'salary_min', 'salary_max','isdeleted']