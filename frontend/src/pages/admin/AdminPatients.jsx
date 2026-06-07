import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Users, Activity, ShieldAlert, FileText, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AdminPatients = () => {
  const { logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Doctors', path: '/admin/doctors', icon: ShieldAlert },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  useEffect(() => {
    api.get('/api/patients/')
      .then(res => setPatients(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="Manage Patients" />
        <div style={{ padding: '0 1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Patient Registry</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>View and manage all registered patients.</p>
          </div>

          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'linear-gradient(to right, #f8fafc, #f1f5f9)' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>All Patients</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.02)', color: '#64748b', fontSize: '0.875rem' }}>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Name / Email</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Phone</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Gender / Blood</th>
                    <th style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>Emergency Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading patients…</td></tr>
                  ) : patients.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No patients found.</td></tr>
                  ) : patients.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{p.user_detail.username}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{p.user_detail.email}</div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>{p.user_detail.phone || 'N/A'}</td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ display: 'inline-block', background: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginRight: '0.5rem' }}>
                          {p.gender}
                        </span>
                        <span style={{ display: 'inline-block', background: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {p.blood_group}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#475569' }}>{p.emergency_contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPatients;
