import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/Dashboard';
import Booking from './pages/patient/Booking';
import AppointmentHistory from './pages/patient/AppointmentHistory';
import PatientProfile from './pages/patient/PatientProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminPatients from './pages/admin/AdminPatients';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Root redirect based on auth state */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient routes — protected, patient-role only */}
        <Route path="/patient/dashboard" element={<PrivateRoute role="patient"><PatientDashboard /></PrivateRoute>} />
        <Route path="/patient/book" element={<PrivateRoute role="patient"><Booking /></PrivateRoute>} />
        <Route path="/patient/appointments" element={<PrivateRoute role="patient"><AppointmentHistory /></PrivateRoute>} />
        <Route path="/patient/profile" element={<PrivateRoute role="patient"><PatientProfile /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/patients" element={<PrivateRoute role="admin"><AdminPatients /></PrivateRoute>} />
        <Route path="/admin/doctors" element={<PrivateRoute role="admin"><AdminDoctors /></PrivateRoute>} />
        <Route path="/admin/reports" element={<PrivateRoute role="admin"><AdminReports /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute role="admin"><AdminSettings /></PrivateRoute>} />
        <Route path="/admin/profile" element={<PrivateRoute role="admin"><AdminProfile /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
