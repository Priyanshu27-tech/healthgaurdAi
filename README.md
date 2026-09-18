# HealthGuard AI - Modern Healthcare Digital Platform

HealthGuard AI is a production-grade digital healthcare platform connecting patients and certified healthcare practitioners. It provides secure role-based access control (Patient & Doctor), health profile tracking, multi-step clinical assessments, physician review workflows, appointment scheduling, and encrypted medical document archives.

---

## Important Architectural Compliance

> [!IMPORTANT]
> **Zero Automated Diagnosis / Zero AI Inference in Current Release**:
> - This version contains **NO** machine learning inference, prediction algorithms, or Python ML services.
> - The application strictly avoids fake percentages, fabricated diagnoses, or synthetic disease predictions.
> - All health reviews and guidance are conducted and authored exclusively by licensed human physicians.
> - A dedicated service placeholder (`server/services/predictionService.js`) and UI container (`client/src/components/common/PredictionPanel.jsx`) are pre-architected so that a Python/FastAPI microservice (`POST /api/predictions`) can be seamlessly connected in future phases without breaking schema contracts.

---

## Core Features

### 1. Dual-Role Architecture & RBAC
- **Patient Role**: Submit assessments, maintain personal health vitals, manage appointments with specialists, archive medical documents, and review attending physician clinical notes.
- **Doctor Role**: Review pending patient triage queues, write structured clinical evaluations, search and inspect longitudinal patient charts, and manage daily consultation schedules.
- **Strict Authorization**: Middleware guards ensure patients cannot access physician triage or other patients' private health data (HTTP 403 Forbidden).

### 2. Patient Health Overview & Vitals
- Real-time tracking of Blood Pressure (systolic/diastolic), Resting Heart Rate, Body Weight, Calculated BMI, and Fasting Blood Glucose.
- Interactive longitudinal vital trends visualization powered by **Recharts**.
- Documented chronic conditions, known allergies, active prescribed medications, and emergency contacts.

### 3. Structured Health Assessment Workflow
- Multi-step clinical assessment questionnaire:
  - Vitals snapshot (BP, heart rate, body temperature, height, weight).
  - Symptoms multi-select checklist (fever, cough, chest discomfort, shortness of breath, dizziness, etc.).
  - Lifestyle indicators (smoking, alcohol, physical activity, sleep duration, dietary pattern).
  - Medical & surgical history (hypertension, diabetes, family history, previous surgeries).
- Neutral, reassuring submission confirmation without diagnostic bias.

### 4. Doctor Clinical Review & Triage
- Priority review queue for physicians displaying incoming patient submissions.
- Complete clinical inspection view including vital snapshots and symptom checklists.
- Dedicated doctor review panel allowing physicians to document clinical notes, record lifestyle guidance, and assign determination status (`Reviewed` or `Requires Follow-up`).
- Real-time patient notifications when reviews are finalized.

### 5. Appointments & Medical Records
- Appointment booking with registered specialists, time-slot selection, visit reason, and status lifecycle (`Scheduled` -> `Completed` / `Cancelled`).
- Encrypted medical document archive for lab reports, imaging scans, and physician consultation summaries with cryptographic metadata tracking.

---

## Technology Stack

- **Frontend**:
  - React 18 / 19
  - Vite
  - React Router v6
  - Tailwind CSS (Custom healthcare and clinical color tokens)
  - Lucide React icons
  - Axios (with JWT interceptors)
  - Recharts (responsive vital trend charts)
- **Backend**:
  - Node.js (v24.x LTS)
  - Express.js
  - MongoDB & Mongoose ORM
  - Standalone embedded development database fallback (`mongodb-memory-server`) for 100% turnkey zero-configuration setup
  - JSON Web Tokens (`jsonwebtoken`)
  - Password hashing via `bcryptjs`
  - CORS security & centralized error handling

---

## System Architecture

```
Frontend (React + Vite + Tailwind + Recharts)
   │
   ▼  REST API (JWT Bearer Token / JSON)
Express.js Backend Server (Port 5000)
   ├── Auth Middleware (JWT & RBAC Guards)
   ├── Error Sanitization & Input Validation
   └── Prediction Service [Phase 1: Inactive Standby]
   │
   ▼
Mongoose ORM ──▶ MongoDB (Local / External URI / Isolated Dev Engine)

Future Phase 2 Architecture:
React ──▶ Express ──▶ Prediction Service ──▶ Python / FastAPI ML API ──▶ ML Model ──▶ Express ──▶ MongoDB
```

---

## Folder Structure

```
healthguard-ai/
 ├── client/
 │    ├── src/
 │    │    ├── assets/
 │    │    ├── components/
 │    │    │    ├── common/
 │    │    │    │    ├── Badge.jsx
 │    │    │    │    ├── Button.jsx
 │    │    │    │    ├── Card.jsx
 │    │    │    │    ├── DoctorReviewPanel.jsx
 │    │    │    │    ├── EmptyState.jsx
 │    │    │    │    ├── Footer.jsx
 │    │    │    │    ├── HealthMetricCard.jsx
 │    │    │    │    ├── Input.jsx
 │    │    │    │    ├── LoadingSpinner.jsx
 │    │    │    │    ├── Modal.jsx
 │    │    │    │    ├── Navbar.jsx
 │    │    │    │    ├── PredictionPanel.jsx (Future ML container)
 │    │    │    │    ├── Select.jsx
 │    │    │    │    └── Sidebar.jsx
 │    │    ├── context/
 │    │    │    └── AuthContext.jsx
 │    │    ├── layouts/
 │    │    │    └── DashboardLayout.jsx
 │    │    ├── pages/
 │    │    │    ├── doctor/
 │    │    │    │    ├── DoctorAppointmentsPage.jsx
 │    │    │    │    ├── DoctorDashboard.jsx
 │    │    │    │    ├── DoctorPatientDetailPage.jsx
 │    │    │    │    ├── DoctorPatientsPage.jsx
 │    │    │    │    ├── DoctorProfilePage.jsx
 │    │    │    │    └── DoctorReviewPage.jsx
 │    │    │    ├── patient/
 │    │    │    │    ├── AppointmentsPage.jsx
 │    │    │    │    ├── AssessmentHistoryPage.jsx
 │    │    │    │    ├── HealthAssessmentPage.jsx
 │    │    │    │    ├── MedicalRecordsPage.jsx
 │    │    │    │    ├── PatientDashboard.jsx
 │    │    │    │    └── PatientProfile.jsx
 │    │    │    ├── ForgotPasswordPage.jsx
 │    │    │    ├── LandingPage.jsx
 │    │    │    ├── LoginPage.jsx
 │    │    │    ├── NotificationsPage.jsx
 │    │    │    ├── RegisterPage.jsx
 │    │    │    └── SettingsPage.jsx
 │    │    ├── services/
 │    │    │    └── api.js
 │    │    ├── utils/
 │    │    │    └── formatters.js
 │    │    ├── App.jsx
 │    │    ├── index.css
 │    │    └── main.jsx
 │    ├── index.html
 │    ├── package.json
 │    ├── postcss.config.js
 │    ├── tailwind.config.js
 │    └── vite.config.js
 └── server/
      ├── config/
      │    └── db.js
      ├── controllers/
      │    ├── appointmentController.js
      │    ├── assessmentController.js
      │    ├── authController.js
      │    ├── doctorController.js
      │    ├── notificationController.js
      │    ├── patientController.js
      │    └── recordController.js
      ├── middleware/
      │    ├── auth.js
      │    ├── errorHandler.js
      │    └── rbac.js
      ├── models/
      │    ├── Appointment.js
      │    ├── Assessment.js
      │    ├── DoctorProfile.js
      │    ├── DoctorReview.js
      │    ├── MedicalRecord.js
      │    ├── Notification.js
      │    ├── PatientProfile.js
      │    └── User.js
      ├── routes/
      │    ├── appointmentRoutes.js
      │    ├── assessmentRoutes.js
      │    ├── authRoutes.js
      │    ├── doctorRoutes.js
      │    ├── notificationRoutes.js
      │    ├── patientRoutes.js
      │    └── recordRoutes.js
      ├── seed/
      │    └── seedData.js
      ├── services/
      │    └── predictionService.js (Future ML architecture bridge)
      ├── .env
      ├── .env.example
      ├── package.json
      ├── server.js
      └── test_e2e.js
```

---

## Installation & Setup

### Prerequisites
- Node.js v18+ (tested on Node.js v24 LTS)
- NPM v9+

### 1. Server Setup
```bash
cd server
npm install
npm run seed     # (Optional: Seeds demo patients and doctors)
npm run dev      # Starts Express server on http://localhost:5000
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev      # Starts Vite client on http://localhost:5173
```

### 3. Automated Verification Test Suite
Run the 14-point end-to-end integration and security test:
```bash
cd server
node test_e2e.js
```

---

## Environment Variables

Configured in `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/healthguard_ai
JWT_SECRET=healthguard_super_secure_jwt_secret_key_2026_production
CLIENT_URL=http://localhost:5173
```

> **Note on MongoDB**: If a local or external MongoDB instance is running, HealthGuard AI automatically connects to it. If not running, the built-in isolated in-memory engine boots automatically so that the platform runs turnkey without configuration.

---

## Demo Credentials

Pre-seeded accounts are provided for instant evaluation (also accessible via 1-click buttons on `/login`):

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Doctor** | `doctor@example.com` | `Password123!` | Dr. Sarah Chen, MD (Cardiology & Internal Medicine) |
| **Doctor (Secondary)** | `marcus.vance@example.com` | `Password123!` | Dr. Marcus Vance, MD (Saint Jude Memorial Hospital) |
| **Patient** | `patient@example.com` | `Password123!` | Alexander Wright (Age 38, Active Vitals & History) |
| **Patient (Secondary)** | `sophia.rodriguez@example.com` | `Password123!` | Sophia Rodriguez (Pending Review Queue) |
| **Patient (Third)** | `david.miller@example.com` | `Password123!` | David Miller (Requires Follow-up Consultation) |

---

## API Overview

### Authentication
- `POST /api/auth/register` - Create patient or doctor account
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Validate session and retrieve profile
- `POST /api/auth/forgot-password` - Account recovery link

### Patient Endpoints (Requires Patient JWT)
- `GET /api/patients/profile` - Retrieve health profile
- `PUT /api/patients/profile` - Update vitals and demographics
- `GET /api/patients/assessments` - Historical assessments and reviews
- `GET /api/patients/appointments` - Patient consultation schedule
- `GET /api/patients/records` - Patient medical documents

### Doctor Endpoints (Requires Doctor JWT)
- `GET /api/doctors` - Directory of verified physicians (for patient booking)
- `GET /api/doctors/profile` - Retrieve doctor credentials
- `PUT /api/doctors/profile` - Update practice info
- `GET /api/doctors/patients` - Searchable patient directory
- `GET /api/doctors/patients/:id` - Full electronic health record chart
- `GET /api/doctors/assessments` - Physician triage review queue
- `GET /api/doctors/assessments/:id` - Complete assessment inspection
- `POST /api/doctors/reviews` - Submit clinical review & patient guidance
- `GET /api/doctors/appointments` - Daily physician consultation schedule

### Assessments & Records
- `POST /api/assessments` - Submit new health questionnaire (Patient)
- `GET /api/assessments/:id` - Retrieve assessment by ID
- `POST /api/appointments` - Schedule appointment
- `PUT /api/appointments/:id` - Update appointment status (`Scheduled`, `Completed`, `Cancelled`)
- `POST /api/records` - Archive medical document
- `GET /api/records/:patientId` - View patient documents
- `GET /api/notifications` - User notifications
- `GET /api/predictions/status` - Future ML readiness check

---

## Future ML Integration Plan

When machine learning inference is integrated in Phase 2:
1. A Python/FastAPI microservice running PyTorch / ONNX models will be deployed (e.g. `http://ml-service:8000`).
2. The endpoint `POST /api/assessments` will dispatch a background payload through `server/services/predictionService.js`.
3. The ML service will compute risk stratification and feature contributions:
   ```json
   {
     "prediction": "Cardiovascular Risk Stratification",
     "probability": 0.24,
     "riskLevel": "Low",
     "explanation": [
       { "feature": "bloodPressure_systolic", "contribution": 0.12 },
       { "feature": "smoking_status", "contribution": 0.08 }
     ]
   }
   ```
4. The frontend `PredictionPanel.jsx` will immediately render the results with feature impact bars, seamlessly transitioning without UI redesign.

---

## Security & Medical Disclaimers

- **Zero Autonomous Medical Diagnoses**: The platform does not claim to diagnose diseases or recommend medications algorithmically.
- **Data Encryption**: Authentication passwords salted and hashed via bcrypt; JWT authentication tokens signed with SHA-256; role boundaries enforced on every endpoint.
- **Emergency Disclaimer**: In any acute medical emergency, patients are instructed to immediately contact local emergency services.
