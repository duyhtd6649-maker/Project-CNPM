from rest_framework import serializers
from database.models.jobs import Applications

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = ['id', 'job_id', 'cvsid', 'job_status','system_status']
        read_only_fields = ['id','job_status','system_status']