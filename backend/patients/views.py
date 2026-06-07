from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_patients(request):
    patients = Patient.objects.all().order_by('-user__date_joined')
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def patient_profile(request):
    try:
        patient = Patient.objects.get(user=request.user)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient profile not found.'}, status=404)

    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Update user fields if provided
        user_data = request.data.get('user', {})
        if user_data:
            user = request.user
            if 'phone' in user_data:
                user.phone = user_data['phone']
            user.save()

        # Update patient fields
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
