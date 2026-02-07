from rest_framework import serializers
from database.models.jobs import Applications

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source = 'job.title', read_only = True)
    company = serializers.CharField(source = 'job.company.name',read_only = True)
    user_name = serializers.CharField(source = 'candidate.user.fullname', read_only = True)
    user_phone = serializers.CharField(source = 'candidate.user.phone', read_only = True)
    user_email = serializers.CharField(source = 'candidate.user.email', read_only = True)
    class Meta:
        model = Applications
        fields = ['id', 'job_id', 'cvsid', 'job_status','system_status', 'job_title','created_date','company','user_name','user_phone','user_email']
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