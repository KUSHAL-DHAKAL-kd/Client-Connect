from rest_framework import serializers
from .models import Doctor, DoctorAvailability


class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = ['id', 'doctor', 'day', 'start_time', 'end_time']
        read_only_fields = ['doctor']


class DoctorSerializer(serializers.ModelSerializer):
    availability = DoctorAvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'phone', 'email', 'is_available', 'created_at', 'availability']