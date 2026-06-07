from django.urls import path
from .views import get_all_patients, patient_profile

urlpatterns = [
    path('me/', patient_profile, name='patient_profile'),
    path('', get_all_patients, name='get_all_patients'),
]