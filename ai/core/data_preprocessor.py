import pandas as pd
from sklearn.preprocessing import LabelEncoder
from appointments.models import Appointment

class DataPreprocessor:
    def extract_and_engineer(self):
        # Query completed and cancelled appointments
        qs = Appointment.objects.filter(status__in=['completed', 'cancelled']).select_related('doctor')
        
        if not qs.exists():
            return None, None, None

        # Build records
        records = []
        for apt in qs:
            records.append({
                'day_of_week': apt.appointment_date.weekday(),
                'hour_of_day': apt.appointment_time.hour,
                'doctor__specialization': apt.doctor.specialization,
                'status': apt.status
            })

        df = pd.DataFrame(records)

        # Feature engineering
        le = LabelEncoder()
        df['specialization_encoded'] = le.fit_transform(df['doctor__specialization'])
        df['target'] = df['status'].apply(lambda x: 1 if x == 'completed' else 0)

        # Frequency encoding logic - keeping it simple per instructions
        # Note: In the prompt, booking_frequency was mentioned but we don't have historical data 
        # to properly count frequency per slot without complex groupby. 
        # For this version, we will focus on day, hour, and specialization.
        
        # Calculate booking_frequency per (day_of_week, hour_of_day, specialization_encoded)
        frequency_df = df.groupby(['day_of_week', 'hour_of_day', 'specialization_encoded']).size().reset_index(name='booking_frequency')
        df = df.merge(frequency_df, on=['day_of_week', 'hour_of_day', 'specialization_encoded'], how='left')

        features = ['day_of_week', 'hour_of_day', 'specialization_encoded', 'booking_frequency']
        
        X = df[features]
        y = df['target']

        return X, y, le
