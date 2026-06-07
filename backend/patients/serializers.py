from rest_framework import serializers
from .models import Patient
from authentication.serializers import UserSerializer

class PatientSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'user_detail', 'date_of_birth', 'blood_group', 'gender', 'emergency_contact']
