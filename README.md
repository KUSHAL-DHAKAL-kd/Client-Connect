# Clinic Connect — Development Roadmap

> **Online Appointment Management System with AI-Based Slot Suggestion**
> Final Year Project | Kushal Dhakal (LC00017001951) | Lincoln University College, Malaysia | 2026

---

## Project Overview

Clinic Connect is a lightweight, web-based clinic appointment management system targeting small and medium clinics in Nepal and South Asia. It replaces manual phone-based booking with a responsive digital platform that integrates a **Decision Tree ML model** for AI-powered appointment slot suggestions.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                         │
│               React.js 18  +  Axios 1.x                     │
│         (Patient UI  |  Admin Dashboard)                    │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API (JSON + JWT)
┌─────────────────────▼───────────────────────────────────────┐
│                  APPLICATION LAYER                          │
│          Django REST Framework 4.1  +  SimpleJWT            │
│      Business Logic | Auth | RBAC | Appointment Rules       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AI MODULE (Python)                      │   │
│  │   scikit-learn DecisionTreeClassifier | joblib       │   │
│  │   DataPreprocessor | ModelTrainer | SlotPredictor    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ PyMySQL
┌─────────────────────▼───────────────────────────────────────┐
│                    DATA LAYER                               │
│                   MySQL 8.0                                 │
│   users | doctors | availability | appointments | reports   │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React.js | 18.x |
| HTTP Client | Axios | 1.x |
| Router | React Router DOM | 6.x |
| Backend | Django REST Framework | 4.1.x |
| Auth | SimpleJWT | 5.x |
| CORS | django-cors-headers | 4.x |
| Database | MySQL / MariaDB | 8.0 / 10.5+ |
| DB Connector | PyMySQL | 1.x |
| ML Model | scikit-learn | 1.x |
| Deployment (frontend) | Firebase Hosting | latest |
| Deployment (backend) | Railway / Render | latest |
| Version Control | Git + GitHub | latest |

---

## Development Methodology

**Incremental Development Model** — the system is built and delivered in 5 increments. Each increment adds new functionality on top of a stable, tested foundation. Modules (auth, doctors, appointments, AI, reports) are developed and tested independently before integration.

---

## Roadmap Summary

| Phase | Title | Weeks | Deliverable |
|---|---|---|---|
| Phase 1 | Project Setup & Authentication | Weeks 1–2 | Working login/register with role-based JWT auth |
| Phase 2 | Doctor Management Module | Weeks 3–4 | Doctor profiles & availability scheduling |
| Phase 3 | Appointment Booking & Management | Weeks 5–6 | Full booking, approval, and cancellation workflow |
| Phase 4 | AI Slot Suggestion (Decision Tree) | Weeks 7–8 | AI-powered slot recommendations on booking page |
| Phase 5 | Reports, Testing & Deployment | Weeks 9–10 | Deployed, tested, production-ready system |

---

## Phase 1 — Project Setup & Authentication
**Duration:** Weeks 1–2 | **Increment:** 1

### Goal
Establish the full technical foundation: project structure, database schema, and JWT-based authentication for both patient and admin roles.

### Tasks
- [x] Initialize React.js 18 frontend with Vite
- [x] Set up Django REST Framework backend project structure
- [x] Configure MySQL 8 database and run initial migrations (Successfully migrated from SQLite fallback)
- [x] Build custom `User` model extending `AbstractUser` with `role` field (`patient` / `admin`), `phone`, and `address`
- [x] Implement JWT authentication using `SimpleJWT`
- [x] Create `POST /api/auth/register/` and `POST /api/auth/login/` endpoints
- [x] Build Login and Register pages in React
- [x] Configure Axios with `Authorization: Bearer <token>` header interceptor
- [x] Set up `django-cors-headers` for frontend-backend communication
- [x] Initialize GitHub repository with `.gitignore` and `README.md`

### Deliverable
> Fully working patient and admin login/register flow with role-based JWT authentication.

### Key Considerations
- Always hash passwords using Django's built-in PBKDF2 algorithm — never store plaintext
- Set up an Axios request interceptor to automatically attach the JWT token to every API request and handle `401` token-expired errors
- Define and migrate **all 6 MySQL tables** upfront even if only `User` is populated now — changing models after data exists causes painful migration conflicts
- Test `register` and `login` endpoints with Postman before building the React pages

---

## Phase 2 — Doctor Management Module
**Duration:** Weeks 3–4 | **Increment:** 2

### Goal
Introduce core administrative functionality. Admins create doctor profiles and define weekly availability schedules. Patients can view available doctors before booking.

### Tasks
- [x] Create `Doctor` model (`id`, `name`, `specialization`, `phone`, `email`, `is_available`, `created_at`)
- [x] Create `DoctorAvailability` model (`id`, `doctor_id` FK, `day`, `start_time`, `end_time`)
- [x] Build `DoctorSerializer` and `AvailabilitySerializer` with nested serialization
- [x] CRUD API endpoints for doctor profiles — protected with `IsAdminUser` permission
- [ ] Availability schedule management endpoints
- [x] Admin dashboard UI — doctor list, add, and edit forms
- [x] Patient-facing doctor listing page showing `is_available` status
- [x] Role-based access control enforced on all doctor endpoints
- [x] Test all doctor APIs using Postman / Thunder Client
- [ ] Write basic unit tests for the `Doctor` model

### Deliverable
> Admin can add doctors and set weekly availability schedules. Patients can view the doctor listing.

### Key Considerations
- `DoctorAvailability` stores one row per day per doctor (e.g. `Monday 09:00–17:00`)
- Use DRF's `permission_classes = [IsAdminUser]` to protect create/update/delete doctor endpoints
- Validate that availability time slots do not overlap when admin creates schedules
- The patient-facing doctor list must show `is_available` so patients know who is active

---

## Phase 3 — Appointment Booking & Management
**Duration:** Weeks 5–6 | **Increment:** 3

### Goal
Build the core feature of Clinic Connect. Patients search for doctors, select a slot, and submit a booking. Admins approve or cancel appointments. Conflict-prevention logic blocks double-bookings.

### Tasks
- [x] Create `Appointment` model (`id`, `patient_id` FK, `doctor_id` FK, `appointment_date`, `appointment_time`, `status`, `reason`, `notes`, `created_at`)
- [x] Status field values: `pending` | `approved` | `cancelled` | `completed`
- [x] Build `AppointmentSerializer` with nested doctor and patient detail fields
- [x] `POST /api/appointments/create/` endpoint (patients only)
- [x] `GET /api/appointments/` endpoint filtered by authenticated user role
- [x] Appointment approve/cancel endpoints (admin only)
- [x] Patient cancellation endpoint — validates `patient_id` matches JWT token owner
- [x] Book Appointment page — doctor picker, date picker, time input, reason textarea
- [x] Appointment History page with colour-coded status badges
- [x] Admin panel — appointment list with approve/cancel controls
- [x] Backend double-booking prevention logic

### Deliverable
> Patients can book and cancel appointments. Admins can approve and manage all bookings.

### Key Considerations
- New appointments default to `status = "pending"` and require admin approval
- Prevent double-booking by checking for an existing appointment with the same `doctor_id`, `appointment_date`, and `appointment_time` before inserting
- Only allow patients to cancel their **own** appointments — validate `patient_id` against the JWT token owner
- Complete a full end-to-end test (book → admin approves → patient cancels) before moving to Phase 4

---

## Phase 4 — AI Slot Suggestion (Decision Tree)
**Duration:** Weeks 7–8 | **Increment:** 4

### Goal
Integrate the ML component. A `DecisionTreeClassifier` analyses historical booking patterns and recommends optimal appointment time slots for patients on the booking page.

### Tasks
- [x] Design `DataPreprocessor` class — extracts historical appointment records from MySQL
- [x] Feature engineering: `day_of_week` (0–6), `hour_of_day` (8–18), `doctor_specialization` (encoded), `booking_frequency`
- [x] Label-encode categorical features using `LabelEncoder` from scikit-learn
- [x] Split data into train/test sets (80/20 split) using `train_test_split`
- [x] Train `DecisionTreeClassifier` and evaluate with `accuracy_score`
- [x] Save trained model to disk using `joblib.dump()`
- [x] Build `SlotPredictor` class — loads model at startup and generates slot recommendations
- [x] Build `ModelTrainer` class — handles full training pipeline
- [x] Create `GET /api/ai/suggest-slot/` endpoint
- [x] Integrate AI suggestions into the Book Appointment UI
- [x] Seed database with at least 100–150 realistic historical appointment records before training

### Deliverable
> AI-powered slot suggestions appear on the booking page based on historical booking patterns.

### AI Module Structure

```
ai/
├── data_preprocessor.py   # Loads and engineers features from MySQL
├── model_trainer.py       # Trains, evaluates, and saves the Decision Tree
├── slot_predictor.py      # Loads saved model and returns top slot predictions
└── saved_model/
    └── decision_tree.joblib
```

### Feature Schema

```python
# Features used for training and prediction
features = {
    "day_of_week": int,          # 0 = Monday, 6 = Sunday
    "hour_of_day": int,          # 8–18 (clinic hours)
    "doctor_specialization": int, # LabelEncoded string
    "booking_frequency": int,    # Historical bookings for this slot
}
target = "recommended_slot"      # Optimal time slot label
```

### Key Considerations
- Seed the database with realistic data covering diverse doctors, days, and time slots **before** training
- Save the model with `joblib.dump()` after training and load it **once at server startup** — never retrain on every request
- The AI suggestion is **advisory** — the patient still manually confirms the final booking
- The model will need periodic retraining as new booking data accumulates

---

## Phase 5 — Reports, Testing & Deployment
**Duration:** Weeks 9–10 | **Increment:** 5

### Goal
Add administrative reporting, validate the full system through testing, and deploy to production hosting.

### Tasks
- [ ] Create `DailyReport` model (`id`, `doctor_id` FK, `report_date`, `total_appointments`, `completed_appointments`, `cancelled_appointments`, `created_at`)
- [ ] Build daily report aggregation logic using Django ORM queries
- [ ] `GET /api/reports/` endpoint (admin only) returning daily summaries
- [ ] Admin reports page with downloadable summary output
- [ ] Write unit tests for all key API endpoints using Django `TestCase`
- [ ] Perform manual end-to-end testing of all user flows
- [ ] Fix all bugs identified during testing
- [ ] Build React app for production: `npm run build`
- [ ] Deploy frontend to **Firebase Hosting**
- [ ] Deploy Django backend to **Railway** or **Render**
- [ ] Configure production MySQL database and environment variables

### Deliverable
> Fully deployed, tested, and production-ready Clinic Connect system.

### Deployment Checklist

```bash
# Backend
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS with production domain
- [ ] Use python-decouple for SECRET_KEY, DB credentials, JWT secrets
- [ ] Run: python manage.py collectstatic
- [ ] Run: python manage.py migrate on production DB

# Frontend
- [ ] Update Axios baseURL to production backend URL
- [ ] Run: npm run build
- [ ] Deploy /dist folder to Firebase Hosting

# Database
- [ ] Set up production MySQL instance
- [ ] Run all migrations on production DB
- [ ] Seed with initial doctor and admin user data
```

### Key Considerations
- Use `python-decouple` to manage `SECRET_KEY`, `DATABASE_URL`, and `DEBUG` — **never commit secrets to GitHub**
- `DailyReport` generation aggregates total, completed, and cancelled appointments per doctor per date
- Run `python manage.py test` and fix all failures before deploying

---

## Database Schema

```
authentication_user
├── id (PK, int, auto)
├── username (varchar)
├── email (varchar, unique)
├── password (varchar, hashed PBKDF2)
├── role (enum: 'patient' | 'admin')
├── phone (varchar, nullable)
└── created_at (datetime)

doctors_doctor
├── id (PK, int, auto)
├── name (varchar)
├── specialization (varchar)
├── phone (varchar)
├── email (varchar)
├── is_available (bool, default: true)
└── created_at (datetime)

doctors_doctoravailability
├── id (PK, int, auto)
├── doctor_id (FK → doctors_doctor.id)
├── day (enum: Mon–Sun)
├── start_time (time)
└── end_time (time)

patients_patient
├── id (PK, int, auto)
├── user_id (FK → authentication_user.id, unique)
├── date_of_birth (date)
├── blood_group (varchar)
├── gender (varchar)
└── emergency_contact (varchar)

appointments_appointment
├── id (PK, int, auto)
├── patient_id (FK → patients_patient.id)
├── doctor_id (FK → doctors_doctor.id)
├── appointment_date (date)
├── appointment_time (time)
├── status (enum: pending | approved | cancelled | completed)
├── reason (text)
├── notes (text, nullable)
└── created_at (datetime)

reports_dailyreport
├── id (PK, int, auto)
├── doctor_id (FK → doctors_doctor.id)
├── report_date (date)
├── total_appointments (int)
├── completed_appointments (int)
├── cancelled_appointments (int)
└── created_at (datetime)
```

---

## API Endpoint Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | Public | Register new patient account |
| POST | `/api/auth/login/` | Public | Login and receive JWT tokens |
| GET | `/api/auth/profile/` | Authenticated | Get current user profile |

### Doctors
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/doctors/` | Authenticated | List all doctors |
| POST | `/api/doctors/` | Admin | Create new doctor profile |
| GET | `/api/doctors/<id>/` | Authenticated | Get doctor detail |
| PUT | `/api/doctors/<id>/` | Admin | Update doctor profile |
| DELETE | `/api/doctors/<id>/` | Admin | Delete doctor |

### Appointments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/appointments/` | Authenticated | List appointments (role-filtered) |
| POST | `/api/appointments/create/` | Patient | Book new appointment |
| GET | `/api/appointments/<id>/` | Authenticated | Get appointment detail |
| PATCH | `/api/appointments/<id>/` | Admin | Approve or cancel appointment |
| DELETE | `/api/appointments/<id>/` | Patient (own) | Cancel own appointment |

### AI
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/ai/suggest-slot/` | Patient | Get AI-recommended time slots |

### Reports
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/reports/` | Admin | List daily appointment reports |

---

## Out-of-Scope (Future Enhancements)

These features are **intentionally excluded** from v1.0 and represent natural next steps:

- SMS / email appointment reminder notifications
- Advanced analytics dashboards and multi-period reporting
- Telemedicine / video consultation integration
- Detailed patient medical history and prescription management
- Online payment and billing system
- Dedicated Android / iOS mobile application
- Multi-clinic support with super-admin role
- Random Forest or ensemble models for improved slot prediction accuracy

---

## References

- Django Documentation — https://docs.djangoproject.com/
- React Documentation — https://react.dev/
- scikit-learn Documentation — https://scikit-learn.org/
- MySQL 8.0 Reference Manual — https://dev.mysql.com/doc/
- Django REST Framework — https://www.django-rest-framework.org/
- Simple JWT — https://django-rest-framework-simplejwt.readthedocs.io/
- Quinlan, J. R. (1986). Induction of decision trees. *Machine Learning*, 1(1), 81–106.

---

*Clinic Connect v1.0 — Kushal Dhakal — Lincoln University College — 2026*
