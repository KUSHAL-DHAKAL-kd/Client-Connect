from django.urls import path
from .views import get_all_patients

urlpatterns = [
    path('', get_all_patients, name='get_all_patients'),
]