from rest_framework import serializers
from database.models.CV import Cvs, Cvanalysisresult


class CVSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=True, source='file_url', write_only=True)
    file_url = serializers.FileField(read_only=True)
    class Meta:
        model = Cvs
        fields = ['id', 'file', 'file_url', 'created_by', 'file_name', 'file_size', 'created_date']
        read_only_fields = ['id', 'created_by', 'file_name', 'file_size', 'file_url']

    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng PDF.")
        if value.size > 50 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 50MB.")
        return value

class CVScanSerializer(CVSerializer):
    targetjob = serializers.CharField(max_length=255)
    class Meta(CVSerializer.Meta):
        fields = CVSerializer.Meta.fields + ['targetjob']

class CVListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cvs
        fields = ['id','file_name', 'file_url']

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cvanalysisresult
        fields = ['id','cv','target_job','overall_score','content_score','format_score']