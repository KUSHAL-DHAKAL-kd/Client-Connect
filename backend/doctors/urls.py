from django.urls import path
from . import views

urlpatterns = [
    path('', views.doctor_list, name='doctor-list'),
    path('create/', views.doctor_create, name='doctor-create'),
    path('<int:pk>/', views.doctor_detail, name='doctor-detail'),
    # Availability sub-routes
    path('<int:doctor_pk>/availability/', views.availability_list, name='availability-list'),
    path('<int:doctor_pk>/availability/<int:pk>/', views.availability_detail, name='availability-detail'),
]