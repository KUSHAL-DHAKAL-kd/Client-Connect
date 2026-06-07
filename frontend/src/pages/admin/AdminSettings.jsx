import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Users, Activity, ShieldAlert, FileText, Settings, User, Save, Bell, Clock, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { logout } = useAuth();
  
  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Doctors', path: '/admin/doctors', icon: ShieldAlert },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="Clinic Settings" />
        <div style={{ padding: '0 1rem', maxWidth: '900px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>System Preferences</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Configure clinic rules, notifications, and localization.</p>
          </div>

          {saved && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> Settings saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.5rem' }}>
            
            {/* Clinic Details */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <Globe size={20} color="#4f46e5" /> General Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label">Clinic Name</label>
                  <input type="text" className="input-field" defaultValue="Clinic Connect Hub" style={{ paddingLeft: '1rem' }} />
                </div>
                <div className="input-group">
                  <label className="label">Contact Email</label>
                  <input type="email" className="input-field" defaultValue="contact@clinicconnect.com" style={{ paddingLeft: '1rem' }} />
                </div>
                <div className="input-group" style={{ gridColumn: '1/-1' }}>
                  <label className="label">Address</label>
                  <input type="text" className="input-field" defaultValue="123 Health Ave, Kathmandu, Nepal" style={{ paddingLeft: '1rem' }} />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <Clock size={20} color="#059669" /> Operating Hours
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label className="label">Opening Time</label>
                  <input type="time" className="input-field" defaultValue="09:00" style={{ paddingLeft: '1rem' }} />
                </div>
                <div className="input-group">
                  <label className="label">Closing Time</label>
                  <input type="time" className="input-field" defaultValue="17:00" style={{ paddingLeft: '1rem' }} />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <Bell size={20} color="#ea580c" /> Notifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }} />
                  <span style={{ fontWeight: '500', color: '#334155' }}>Email patients upon appointment approval</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }} />
                  <span style={{ fontWeight: '500', color: '#334155' }}>Notify admins on new booking requests</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--primary)' }} />
                  <span style={{ fontWeight: '500', color: '#334155' }}>Enable SMS Reminders (Requires Premium Integration)</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="button-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
