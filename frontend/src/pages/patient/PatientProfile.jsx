import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Activity, Calendar, FileText, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PatientProfile = () => {
  const { user, logout } = useAuth();

  const sidebarLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Activity },
    { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
    { name: 'My Appointments', path: '/patient/appointments', icon: FileText },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="My Profile" />

        <div style={{ padding: '0 1rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, var(--primary), #6366f1)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem auto', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)' }}>
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'PT'}
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{user?.username || 'Patient'}</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#10b981" /> Verified Patient Account
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Account Details</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Username</p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '500' }}>{user?.username || 'Not provided'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#ecfdf5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Email Address</p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '500' }}>{user?.email || 'Not provided'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Phone Number</p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '500' }}>{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.875rem' }}>Want to update your medical details or emergency contact?</p>
              <button className="button-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', fontSize: '0.875rem' }} disabled>
                Edit Medical Profile (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
