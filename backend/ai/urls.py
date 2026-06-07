from django.urls import path
from .views import suggest_slot

urlpatterns = [
    path('suggest-slot/', suggest_slot, name='suggest-slot'),
]
