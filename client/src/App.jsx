import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import HealthAssessmentPage from './pages/patient/HealthAssessmentPage';
import AssessmentHistoryPage from './pages/patient/AssessmentHistoryPage';
import AppointmentsPage from './pages/patient/AppointmentsPage';
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';
import DoctorPatientDetailPage from './pages/doctor/DoctorPatientDetailPage';
import DoctorReviewPage from './pages/doctor/DoctorReviewPage';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';

// Shared Pages
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Patient Workspace */}
          <Route element={<DashboardLayout allowedRole="patient" />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/assessment" element={<HealthAssessmentPage />} />
            <Route path="/patient/assessments" element={<AssessmentHistoryPage />} />
            <Route path="/patient/appointments" element={<AppointmentsPage />} />
            <Route path="/patient/records" element={<MedicalRecordsPage />} />
          </Route>

          {/* Doctor Workspace */}
          <Route element={<DashboardLayout allowedRole="doctor" />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
            <Route path="/doctor/patients/:id" element={<DoctorPatientDetailPage />} />
            <Route path="/doctor/assessments" element={<DoctorDashboard />} />
            <Route path="/doctor/assessments/:id" element={<DoctorReviewPage />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
          </Route>

          {/* Universal Authenticated Pages */}
          <Route element={<DashboardLayout />}>
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
