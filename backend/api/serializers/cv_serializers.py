from rest_framework import serializers
from database.models.CV import Cvs


class CVSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=True,source='file_url')
    class Meta:
        model = Cvs
        fields = ['id', 'file', 'created_by', 'file_name', 'file_size']
        read_only_fields = ['id', 'created_by', 'file_name', 'file_size']

    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng PDF.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value

class CVScanSerializer(CVSerializer):
    targetjob = serializers.CharField(max_length=255)