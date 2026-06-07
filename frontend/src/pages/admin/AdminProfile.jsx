import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Activity, Users, ShieldAlert, FileText, Settings, User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user, logout } = useAuth();

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Patients', path: '#', icon: Users },
    { name: 'Doctors', path: '#', icon: ShieldAlert },
    { name: 'Reports', path: '#', icon: FileText },
    { name: 'Settings', path: '#', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="Admin Profile" />

        <div style={{ padding: '0 1rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem auto', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}>
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{user?.username || 'Administrator'}</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#3b82f6" /> System Administrator
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Administrator Details</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                  <User size={20} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Username</p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '500' }}>{user?.username || 'Not provided'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Email Address</p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '500' }}>{user?.email || 'Not provided'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Phone Number</p>
                  <p style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: '500' }}>{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
