import random
from datetime import timedelta, date, time
from django.core.management.base import BaseCommand
from django.utils import timezone
from appointments.models import Appointment
from doctors.models import Doctor
from patients.models import Patient

class Command(BaseCommand):
    help = 'Seeds the database with 150 historical appointments for AI training'

    def handle(self, *args, **options):
        doctors = list(Doctor.objects.all())
        patients = list(Patient.objects.all())

        if not doctors or not patients:
            self.stdout.write(self.style.ERROR('Cannot seed appointments. You must have at least 1 doctor and 1 patient in the database.'))
            return

        self.stdout.write("Seeding 150 historical appointments...")

        today = date.today()
        # Weights for hours 9 to 17 (inclusive)
        # Higher weights for 9, 10, 11 (morning)
        hours = list(range(9, 18))
        weights = [15, 20, 15, 10, 5, 10, 10, 10, 5]

        # Weights for status
        statuses = ['completed', 'cancelled']
        status_weights = [70, 30]

        appointments_to_create = []

        for i in range(150):
            doc = random.choice(doctors)
            pat = random.choice(patients)
            
            # Random date within past 180 days
            days_ago = random.randint(1, 180)
            apt_date = today - timedelta(days=days_ago)

            # Random weighted hour
            hour = random.choices(hours, weights=weights, k=1)[0]
            apt_time = time(hour, 0)

            # Random status
            status = random.choices(statuses, weights=status_weights, k=1)[0]

            appointments_to_create.append(Appointment(
                patient=pat.user,
                doctor=doc,
                appointment_date=apt_date,
                appointment_time=apt_time,
                status=status,
                reason='Routine checkup'
            ))

        Appointment.objects.bulk_create(appointments_to_create)

        self.stdout.write(self.style.SUCCESS('Successfully seeded 150 historical appointments!'))
