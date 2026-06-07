# Clinic Connect — AI Slot Suggestion Module Implementation Prompt

Copy and paste this entire prompt to any AI coding assistant (Claude, ChatGPT, Cursor, GitHub Copilot, etc.) to implement the full AI module for Clinic Connect.

---

## PROMPT START — COPY EVERYTHING BELOW THIS LINE

---

I am building **Clinic Connect**, a Django REST Framework + React.js clinic appointment management system. I need you to implement the complete **AI-based slot suggestion module** using a Decision Tree classifier.

---

## Project Context

**Tech Stack:**
- Backend: Django 4.1 + Django REST Framework + SimpleJWT
- Frontend: React.js 18 + Axios
- Database: MySQL 8.0 via PyMySQL
- ML: scikit-learn, pandas, joblib
- Auth: JWT (Bearer token) — all API endpoints require `Authorization: Bearer <token>`

**Existing models already built:**

```python
# appointments/models.py
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField()
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

# doctors/models.py
class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

# patients/models.py
class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date_of_birth = models.DateField()
    blood_group = models.CharField(max_length=5)
    gender = models.CharField(max_length=10)
    emergency_contact = models.CharField(max_length=20)
```

---

## What I Need You To Build

### 1. Folder Structure

Create the following inside the Django backend:

```
backend/
└── ai/
    ├── __init__.py
    ├── apps.py
    ├── urls.py
    ├── views.py
    ├── data_preprocessor.py
    ├── model_trainer.py
    ├── slot_predictor.py
    ├── saved_model/
    │   └── .gitkeep
    └── management/
        └── commands/
            ├── __init__.py
            └── train_model.py

appointments/
└── management/
    └── commands/
        ├── __init__.py
        └── seed_appointments.py
```

---

### 2. seed_appointments.py

Write a Django management command that seeds **150 realistic historical appointment records** into the `Appointment` table using existing `Doctor` and `Patient` records from the database.

Requirements:
- Pull all existing `Doctor` and `Patient` objects from the DB
- Randomly assign doctor and patient pairs
- Set `appointment_date` to random dates within the past 180 days
- Use **weighted hours** to simulate real clinic patterns — morning slots (9am, 10am) should appear more frequently than afternoon slots
- Clinic hours: 9am to 5pm only
- Set `status` to either `completed` (70% chance) or `cancelled` (30% chance)
- Set `reason` to `'Routine checkup'` for all seeded records
- Print a success message when done
- Handle the case where no doctors or patients exist yet and print a helpful error

---

### 3. data_preprocessor.py

Write a `DataPreprocessor` class that:
- Queries all `Appointment` records with `status` in `['completed', 'cancelled']` from the database
- Converts the queryset to a pandas DataFrame
- Engineers these features:
  - `day_of_week` — integer 0 (Monday) to 6 (Sunday) from `appointment_date`
  - `hour_of_day` — integer from `appointment_time`
  - `specialization_encoded` — `doctor__specialization` label-encoded with `sklearn.preprocessing.LabelEncoder`
- Creates a binary `target` column: `1` if `status == 'completed'`, `0` if `status == 'cancelled'`
- Returns `X` (feature DataFrame), `y` (target Series), and the fitted `LabelEncoder` instance

---

### 4. model_trainer.py

Write a `ModelTrainer` class that:
- Uses `DataPreprocessor` to load data
- Splits data 80/20 using `train_test_split` with `random_state=42`
- Trains a `DecisionTreeClassifier` with `max_depth=5` and `random_state=42`
- Evaluates and prints accuracy using `accuracy_score`
- Saves the trained model to `ai/saved_model/decision_tree.joblib` using `joblib.dump()`
- Saves the fitted `LabelEncoder` to `ai/saved_model/label_encoder.joblib`
- Returns the accuracy float

Also write the `train_model` management command that calls `ModelTrainer().train()` and prints the result.

---

### 5. slot_predictor.py

Write a `SlotPredictor` class that:
- Loads `decision_tree.joblib` and `label_encoder.joblib` from `ai/saved_model/` at instantiation
- Has a `suggest(specialization: str, target_date: date)` method that:
  - Gets `day_of_week` from `target_date.weekday()`
  - Encodes `specialization` using the loaded `LabelEncoder` (fall back to `0` if unseen)
  - Scores every hour from 9 to 17 (inclusive) by calling `model.predict_proba()` and extracting the probability of class `1` (completed)
  - Returns the **top 3 slots** as a list of dicts: `[{"time": "09:00", "score": 0.847}, ...]` sorted by score descending

---

### 6. views.py (AI API endpoint)

Write a DRF view for `GET /api/ai/suggest-slot/` that:
- Requires `IsAuthenticated` permission
- Accepts query parameters: `specialization` (string, default `'General'`) and `date` (ISO date string, default today)
- Instantiates `SlotPredictor` **once** at module level (not on every request) to avoid reloading the model repeatedly
- Calls `predictor.suggest(specialization, target_date)` and returns the result
- Handles the case where the model file doesn't exist yet and returns a clear error message with HTTP 503
- Returns JSON: `{"suggested_slots": [{"time": "09:00", "score": 0.847}, ...]}`

---

### 7. urls.py

Wire the view to `path('suggest-slot/', suggest_slot)` inside `ai/urls.py`.

Then in the main `backend/urls.py`, include it as:
```python
path('api/ai/', include('ai.urls')),
```

---

### 8. apps.py

Write the `AiConfig` app config and remind me to add `'ai'` to `INSTALLED_APPS` in `settings.py`.

---

### 9. React Integration

Write a React hook/component snippet for the **Book Appointment page** that:
- Triggers a `GET /api/ai/suggest-slot/` call using Axios whenever `selectedDoctor` and `selectedDate` state both have values
- Uses `useEffect` with `[selectedDoctor, selectedDate]` as dependencies
- Stores the result in `suggestedSlots` state
- Renders the top 3 suggestions as clickable buttons styled differently from regular time slots (use a ⭐ prefix and label them "AI Recommended")
- When a suggestion button is clicked, sets the `appointmentTime` form field to that slot's time value
- Shows a loading state while the API call is in progress
- Silently hides the suggestions section if the API call fails (don't break the booking form)

---

### 10. Implementation Order

Tell me to do these steps in this exact order before writing any code:

1. Make sure at least 3–4 Doctor records and 5–6 Patient records exist in the DB
2. Run `python manage.py seed_appointments` — verify 150 rows appear in the appointments table
3. Run `python manage.py train_model` — confirm accuracy percentage is printed and `.joblib` files appear in `ai/saved_model/`
4. Test the endpoint manually in Postman: `GET /api/ai/suggest-slot/?specialization=General&date=2026-06-10` with a valid JWT Bearer token
5. Integrate into React only after the API is confirmed working in Postman

---

### 11. Additional Requirements

- All file paths should use `os.path.join(os.path.dirname(__file__), ...)` — no hardcoded absolute paths
- Add `ai/saved_model/*.joblib` to `.gitignore` so model files are not committed to GitHub
- The `SlotPredictor` should be importable and testable independently from Django (no Django ORM calls inside it)
- The `DataPreprocessor` handles all ORM calls and returns plain pandas/numpy objects
- Do not use `pickle` — use `joblib` only
- Install requirements: `pip install scikit-learn pandas joblib`

---

### 12. Expected Final API Response

```json
GET /api/ai/suggest-slot/?specialization=Cardiology&date=2026-06-15

Response 200:
{
    "suggested_slots": [
        { "time": "09:00", "score": 0.847 },
        { "time": "10:00", "score": 0.791 },
        { "time": "14:00", "score": 0.683 }
    ]
}

Response 503 (model not trained yet):
{
    "error": "AI model not available. Run: python manage.py train_model"
}
```

---

Please generate all files completely with no placeholders. Each file should be production-ready and follow Django and scikit-learn best practices.

---

## PROMPT END — STOP COPYING HERE
