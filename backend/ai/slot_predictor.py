import os
import joblib
import pandas as pd
from datetime import date

class SlotPredictor:
    def __init__(self):
        current_dir = os.path.dirname(__file__)
        self.model_path = os.path.join(current_dir, 'saved_model', 'decision_tree.joblib')
        self.encoder_path = os.path.join(current_dir, 'saved_model', 'label_encoder.joblib')
        
        self.model = None
        self.le = None

        self.load_artifacts()

    def load_artifacts(self):
        if os.path.exists(self.model_path) and os.path.exists(self.encoder_path):
            self.model = joblib.load(self.model_path)
            self.le = joblib.load(self.encoder_path)

    def suggest(self, specialization: str, target_date: date):
        if self.model is None or self.le is None:
            self.load_artifacts()
            if self.model is None or self.le is None:
                raise RuntimeError("AI model not available. Run: python manage.py train_model")

        day_of_week = target_date.weekday()

        # Handle unseen specializations
        try:
            specialization_encoded = self.le.transform([specialization])[0]
        except ValueError:
            # Fall back to 0 if the specialization wasn't in the training set
            specialization_encoded = 0

        # We need booking_frequency. Since we are predicting future slots, we can use an average or 1 as default.
        # A simple approximation for a new slot is 1.
        default_booking_frequency = 1

        slots = []
        for hour in range(9, 18):  # 9 to 17 inclusive (9am to 5pm)
            features = pd.DataFrame([{
                'day_of_week': day_of_week,
                'hour_of_day': hour,
                'specialization_encoded': specialization_encoded,
                'booking_frequency': default_booking_frequency
            }])
            
            # Predict probabilities
            probas = self.model.predict_proba(features)
            # Probability of class 1 (completed)
            # Depending on classes present in training, index 1 might not exist if all were 1
            if len(self.model.classes_) == 2 and 1 in self.model.classes_:
                prob = probas[0][1]
            else:
                prob = 0.5 # fallback

            # Format hour nicely
            time_str = f"{hour:02d}:00"
            slots.append({"time": time_str, "score": float(prob)})

        # Sort by score descending and return top 3
        slots.sort(key=lambda x: x["score"], reverse=True)
        return slots[:3]
