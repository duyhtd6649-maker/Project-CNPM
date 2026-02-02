from rest_framework import serializers

class CareerCoachRequestSerializer(serializers.Serializer):
    question = serializers.CharField()


class CareerCoachResponseSerializer(serializers.Serializer):
    expectedCareer = serializers.ListField(child=serializers.CharField())
    overview = serializers.ListField(child=serializers.CharField())
    skills = serializers.ListField(child=serializers.CharField())
    learningPaths = serializers.ListField(child=serializers.DictField())


class CvAnalyzerRequestSerializer(serializers.Serializer):
    cvText = serializers.CharField()
    targetJob = serializers.CharField()