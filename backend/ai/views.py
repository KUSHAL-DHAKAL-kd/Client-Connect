from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime
from core.slot_predictor import SlotPredictor

# Instantiate predictor once at module level
predictor = SlotPredictor()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def suggest_slot(request):
    specialization = request.GET.get('specialization', 'General')
    date_str = request.GET.get('date', datetime.today().date().isoformat())

    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

    try:
        suggestions = predictor.suggest(specialization, target_date)
        return Response({'suggested_slots': suggestions})
    except RuntimeError as e:
        return Response({'error': str(e)}, status=503)
    except Exception as e:
        return Response({'error': f'Failed to generate suggestions: {str(e)}'}, status=500)
