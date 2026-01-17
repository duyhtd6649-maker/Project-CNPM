from rest_framework import serializers

class CVScanSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    targetjob = serializers.CharField(max_length=255)

    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Chỉ chấp nhận file định dạng PDF.")
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File quá lớn. Vui lòng upload file dưới 5MB.")
        return value