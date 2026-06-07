from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_patients(request):
    patients = Patient.objects.all().order_by('-user__date_joined')
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)
