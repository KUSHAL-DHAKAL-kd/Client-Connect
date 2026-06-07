from django.urls import path
from . import views

urlpatterns = [
    path('', views.appointment_list, name='appointment-list'),
    path('create/', views.appointment_create, name='appointment-create'),
    path('<int:pk>/', views.appointment_detail, name='appointment-detail'),
    path('<int:pk>/approve/', views.appointment_approve, name='appointment-approve'),
    path('<int:pk>/cancel/', views.appointment_cancel, name='appointment-cancel'),
    path('<int:pk>/complete/', views.appointment_complete, name='appointment-complete'),
]