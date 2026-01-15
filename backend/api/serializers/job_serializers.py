from rest_framework import serializers
from database.models.jobs import Jobs

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = ['id', 'title', 'description', 'location', 'skill', 'salary_min', 'salary_max']