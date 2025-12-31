from rest_framework import serializers
from database.models.users import Users
from rest_framework.validators import UniqueValidator
from dj_rest_auth.registration.serializers import RegisterSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id','fullname','email','username']

class CustomRegisterSerializer(RegisterSerializer):
    email = serializers.EmailField(required = True, validators = [UniqueValidator(queryset=Users.objects.all(),message="Email already exists!")])

