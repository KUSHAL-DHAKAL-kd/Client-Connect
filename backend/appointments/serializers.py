from rest_framework import serializers
from .models import Appointment
from doctors.serializers import DoctorSerializer
from authentication.serializers import UserSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)
    patient_detail = UserSerializer(source='patient', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor',
            'appointment_date', 'appointment_time',
            'status', 'reason', 'notes', 'created_at',
            'doctor_detail', 'patient_detail',
        ]
        read_only_fields = ['patient', 'status', 'created_at']