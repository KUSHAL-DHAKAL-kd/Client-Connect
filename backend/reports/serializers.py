from rest_framework import serializers
from .models import DailyReport
from doctors.serializers import DoctorSerializer


class DailyReportSerializer(serializers.ModelSerializer):
    doctor_detail = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = DailyReport
        fields = [
            'id', 'doctor', 'report_date',
            'total_appointments', 'completed_appointments', 'cancelled_appointments',
            'created_at', 'doctor_detail',
        ]