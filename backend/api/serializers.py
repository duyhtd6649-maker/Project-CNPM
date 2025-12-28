from rest_framework import serializers
from database.models.users import Users

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','fullname','email','username']