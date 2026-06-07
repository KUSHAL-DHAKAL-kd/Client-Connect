from django.db import models
from doctors.models import Doctor

class DailyReport(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='reports')
    report_date = models.DateField()
    total_appointments = models.IntegerField(default=0)
    completed_appointments = models.IntegerField(default=0)
    cancelled_appointments = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report - Dr.{self.doctor.name} on {self.report_date}"