from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer


def is_admin(user):
    return user.is_authenticated and user.role == 'admin'


# ──────────────────────────────────────────────
# LIST ALL APPOINTMENTS (role-filtered)
# ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def appointment_list(request):
    """Admin sees all appointments. Patients see only their own."""
    if is_admin(request.user):
        appointments = Appointment.objects.select_related('doctor', 'patient').all().order_by('-created_at')
    else:
        appointments = Appointment.objects.select_related('doctor', 'patient').filter(
            patient=request.user
        ).order_by('-created_at')
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


# ──────────────────────────────────────────────
# CREATE APPOINTMENT (patient only)
# ──────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def appointment_create(request):
    """Book a new appointment. Patients only. Includes double-booking prevention."""
    if is_admin(request.user):
        return Response({'error': 'Admins cannot book appointments.'}, status=status.HTTP_403_FORBIDDEN)

    doctor_id = request.data.get('doctor')
    appointment_date = request.data.get('appointment_date')
    appointment_time = request.data.get('appointment_time')

    # ── Double-booking prevention ──────────────────────────────────────
    conflict = Appointment.objects.filter(
        doctor_id=doctor_id,
        appointment_date=appointment_date,
        appointment_time=appointment_time,
        status__in=['pending', 'approved'],
    ).exists()
    if conflict:
        return Response(
            {'error': 'This time slot is already booked. Please choose a different time.'},
            status=status.HTTP_409_CONFLICT,
        )
    # ──────────────────────────────────────────────────────────────────

    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(patient=request.user, status='pending')
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ──────────────────────────────────────────────
# APPOINTMENT DETAIL (GET / DELETE)
# ──────────────────────────────────────────────

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail(request, pk):
    """
    GET  — admin or the owning patient.
    DELETE — patient cancelling their own appointment only.
    """
    try:
        appointment = Appointment.objects.select_related('doctor', 'patient').get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Access control: admin or the owning patient
    if not is_admin(request.user) and appointment.patient != request.user:
        return Response({'error': 'You do not have permission to access this appointment.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        # Patients can only cancel their own appointments
        if is_admin(request.user):
            return Response({'error': 'Admins should use the /cancel/ endpoint.'}, status=status.HTTP_400_BAD_REQUEST)
        if appointment.status in ['completed', 'cancelled']:
            return Response({'error': f'Cannot cancel an appointment that is already {appointment.status}.'}, status=status.HTTP_400_BAD_REQUEST)
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'message': 'Appointment cancelled successfully.'})


# ──────────────────────────────────────────────
# ADMIN: APPROVE / CANCEL / COMPLETE
# ──────────────────────────────────────────────

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def appointment_approve(request, pk):
    """Admin approves a pending appointment."""
    if not is_admin(request.user):
        return Response({'error': 'Only admins can approve appointments.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    if appointment.status != 'pending':
        return Response({'error': f'Only pending appointments can be approved. Current status: {appointment.status}.'}, status=status.HTTP_400_BAD_REQUEST)
    appointment.status = 'approved'
    appointment.notes = request.data.get('notes', appointment.notes)
    appointment.save()
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def appointment_cancel(request, pk):
    """Admin cancels any appointment."""
    if not is_admin(request.user):
        return Response({'error': 'Only admins can use this endpoint. Patients use DELETE.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    if appointment.status in ['cancelled', 'completed']:
        return Response({'error': f'Appointment is already {appointment.status}.'}, status=status.HTTP_400_BAD_REQUEST)
    appointment.status = 'cancelled'
    appointment.notes = request.data.get('notes', appointment.notes)
    appointment.save()
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def appointment_complete(request, pk):
    """Admin marks an approved appointment as completed."""
    if not is_admin(request.user):
        return Response({'error': 'Only admins can mark appointments as completed.'}, status=status.HTTP_403_FORBIDDEN)
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)

    if appointment.status != 'approved':
        return Response({'error': 'Only approved appointments can be marked as completed.'}, status=status.HTTP_400_BAD_REQUEST)
    appointment.status = 'completed'
    appointment.save()
    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)