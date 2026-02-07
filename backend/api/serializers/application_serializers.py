from rest_framework import serializers
from database.models.jobs import Applications

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source = 'job.title', read_only = True)
    class Meta:
        model = Applications
        fields = ['id', 'job_id', 'cvsid', 'job_status','system_status', 'job_title']
        read_only_fields = ['id','job_status','system_status']

class ApplicationSystemStatusUpdateSerializer(serializers.Serializer):
    new_status = serializers.ChoiceField(choices=[
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ])
class ApplicationJobStatusUpdateSerializer(serializers.Serializer):
    new_status = serializers.ChoiceField(choices=[
        ('Waiting', 'Waiting'),
        ('Hired', 'Hired'),
        ('Rejected', 'Rejected'),
        ('Scheduling', 'Scheduling')
    ])