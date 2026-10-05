import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPatientPage } from './pages/auth/RegisterPatientPage';
import { RegisterDoctorPage } from './pages/auth/RegisterDoctorPage';
import { VerifyOtpPage } from './pages/auth/VerifyOtpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Dashboards
import { PatientDashboard } from './pages/dashboards/PatientDashboard';
import { DoctorDashboard } from './pages/dashboards/DoctorDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

// Error Pages
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Root redirect handler based on authenticated user session
const RootRedirect: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading CareQ AI..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (user.role) {
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'patient':
    default:
      return <Navigate to="/patient/dashboard" replace />;
  }
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          {/* Default Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Unified Authentication Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register/patient" element={<RegisterPatientPage />} />
          <Route path="/auth/register/doctor" element={<RegisterDoctorPage />} />
          <Route path="/auth/verify" element={<VerifyOtpPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Patient Routes */}
          {[
            '/patient',
            '/patient/dashboard',
            '/patient/doctors',
            '/patient/doctors/:id',
            '/patient/appointments',
            '/patient/consultations',
            '/patient/prescriptions',
            '/patient/medical-records',
            '/patient/health',
            '/patient/ai-assistant',
            '/patient/notifications',
            '/patient/profile',
            '/patient/settings',
            '/patient/*'
          ].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['patient']}>
                    <PatientDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected Doctor Routes */}
          {[
            '/doctor',
            '/doctor/dashboard',
            '/doctor/appointments',
            '/doctor/patients',
            '/doctor/patients/:id',
            '/doctor/consultations',
            '/doctor/prescriptions',
            '/doctor/medical-records',
            '/doctor/schedule',
            '/doctor/analytics',
            '/doctor/earnings',
            '/doctor/notifications',
            '/doctor/ai-assistant',
            '/doctor/profile',
            '/doctor/settings',
            '/doctor/*'
          ].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['doctor']}>
                    <DoctorDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
          ))}

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* 403 Forbidden & 404 Not Found */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
