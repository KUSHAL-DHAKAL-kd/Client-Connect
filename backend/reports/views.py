from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from appointments.models import Appointment
from doctors.models import Doctor
from .models import DailyReport
from .serializers import DailyReportSerializer


def is_admin(user):
    return user.is_authenticated and user.role == 'admin'


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def report_list(request):
    """List all daily reports — admin only."""
    if not is_admin(request.user):
        return Response({'error': 'Only admins can view reports.'}, status=status.HTTP_403_FORBIDDEN)
    reports = DailyReport.objects.select_related('doctor').all().order_by('-report_date')
    serializer = DailyReportSerializer(reports, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_daily_report(request):
    """
    Generate/refresh daily report for today (or a given date).
    Admin only. Aggregates appointments per doctor for the given date.
    """
    if not is_admin(request.user):
        return Response({'error': 'Only admins can generate reports.'}, status=status.HTTP_403_FORBIDDEN)

    report_date = request.data.get('report_date', str(timezone.now().date()))

    doctors = Doctor.objects.all()
    created_reports = []

    for doctor in doctors:
        appointments_qs = Appointment.objects.filter(doctor=doctor, appointment_date=report_date)
        total = appointments_qs.count()
        completed = appointments_qs.filter(status='completed').count()
        cancelled = appointments_qs.filter(status='cancelled').count()

        report, _ = DailyReport.objects.update_or_create(
            doctor=doctor,
            report_date=report_date,
            defaults={
                'total_appointments': total,
                'completed_appointments': completed,
                'cancelled_appointments': cancelled,
            }
        )
        created_reports.append(report)

    serializer = DailyReportSerializer(created_reports, many=True)
    return Response({
        'message': f'Report generated for {report_date}.',
        'reports': serializer.data,
    }, status=status.HTTP_201_CREATED)