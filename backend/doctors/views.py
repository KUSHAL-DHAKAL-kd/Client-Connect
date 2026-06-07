from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Doctor, DoctorAvailability
from .serializers import DoctorSerializer, DoctorAvailabilitySerializer


def is_admin(user):
    """Helper — returns True if the authenticated user has the admin role."""
    return user.is_authenticated and user.role == 'admin'


# ──────────────────────────────────────────────
# DOCTOR ENDPOINTS
# ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def doctor_list(request):
    """List all doctors — public endpoint so patients can browse before logging in."""
    doctors = Doctor.objects.prefetch_related('availability').all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def doctor_create(request):
    """Create a doctor profile — admin only."""
    if not is_admin(request.user):
        return Response({'error': 'Only admins can create doctor profiles.'}, status=status.HTTP_403_FORBIDDEN)
    serializer = DoctorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def doctor_detail(request, pk):
    """Retrieve a single doctor. Modify/delete is admin only."""
    try:
        doctor = Doctor.objects.prefetch_related('availability').get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

    # PUT and DELETE require admin role
    if not is_admin(request.user):
        return Response({'error': 'Only admins can modify doctor profiles.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        doctor.delete()
        return Response({'message': 'Doctor deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


# ──────────────────────────────────────────────
# AVAILABILITY ENDPOINTS
# ──────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def availability_list(request, doctor_pk):
    """List availability for a doctor (any auth user). Create availability — admin only."""
    try:
        doctor = Doctor.objects.get(pk=doctor_pk)
    except Doctor.DoesNotExist:
        return Response({'error': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        slots = DoctorAvailability.objects.filter(doctor=doctor)
        serializer = DoctorAvailabilitySerializer(slots, many=True)
        return Response(serializer.data)

    # POST — admin only
    if not is_admin(request.user):
        return Response({'error': 'Only admins can set availability.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = DoctorAvailabilitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(doctor=doctor)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def availability_detail(request, doctor_pk, pk):
    """Update or delete a specific availability slot — admin only."""
    if not is_admin(request.user):
        return Response({'error': 'Only admins can modify availability.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        slot = DoctorAvailability.objects.get(pk=pk, doctor_id=doctor_pk)
    except DoctorAvailability.DoesNotExist:
        return Response({'error': 'Availability slot not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = DoctorAvailabilitySerializer(slot, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        slot.delete()
        return Response({'message': 'Availability slot removed.'}, status=status.HTTP_204_NO_CONTENT)