from rest_framework import serializers
from database.models.cabinets import CvTemplate, InterviewQuestion, Resource

class CvTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CvTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_date', 'created_by', 'updated_date', 'updated_by', 'isdeleted']

class InterviewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewQuestion
        fields = '__all__'
        read_only_fields = ['id', 'created_date', 'created_by', 'updated_date', 'updated_by', 'isdeleted']

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'
        read_only_fields = ['id', 'created_date', 'created_by', 'updated_date', 'updated_by', 'isdeleted']
