from rest_framework import serializers
from database.models.jobs import Jobs
from database.models.services import Notifications

class JobSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="company.name", read_only=True)
    status = serializers.CharField(read_only = True)
    class Meta:
        model = Jobs
        fields = ['id', 'company', 'title', 'description', 'location', 'skill', 'salary_min', 'salary_max','status']

class JobForFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = ['id', 'title', 'status']

class JobStatusUpdateSerializer(serializers.Serializer):
    new_status = serializers.ChoiceField(choices=[
        ('Open', 'Open'),
        ('Closed', 'Closed')
    ])

class NotificationSerializer(serializers.ModelSerializer):
    actor = serializers.CharField(source = 'receiver_username', read_only = True)
    class Meta:
        model = Notifications
        fields = ['actor', 'message', 'title','created_date']