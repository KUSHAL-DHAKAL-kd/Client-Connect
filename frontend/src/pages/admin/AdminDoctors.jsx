import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Users, Activity, ShieldAlert, FileText, Settings, User, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AdminDoctors = () => {
  const { logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', specialization: '', phone: '', email: '' });
  const [docFormError, setDocFormError] = useState('');

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Doctors', path: '/admin/doctors', icon: ShieldAlert },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  const fetchDoctors = () => {
    setLoading(true);
    api.get('/api/doctors/')
      .then(res => setDoctors(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchDoctors, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setDocFormError('');
    try {
      await api.post('/api/doctors/create/', docForm);
      setShowForm(false);
      setDocForm({ name: '', specialization: '', phone: '', email: '' });
      fetchDoctors();
    } catch (err) {
      const data = err.response?.data;
      setDocFormError(data ? Object.values(data).flat().join(' | ') : 'Failed to add doctor.');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Delete this doctor? This cannot be undone.')) return;
    try {
      await api.delete(`/api/doctors/${id}/`);
      fetchDoctors();
    } catch {
      alert('Failed to delete doctor.');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="Manage Doctors" />
        <div style={{ padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Doctor Roster</h1>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Add, remove, and manage clinic staff.</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="button-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add New Doctor
            </button>
          </div>

          {showForm && (
            <div className="glass-panel slideDown" style={{ padding: '1.5rem', marginBottom: '2rem', border: '2px solid var(--primary)', background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Create Doctor Profile</h3>
              {docFormError && <div style={{ color: '#b91c1c', marginBottom: '1rem', fontSize: '0.875rem', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px' }}>{docFormError}</div>}
              <form onSubmit={handleAddDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  { name: 'name', placeholder: 'Full name', label: 'Name' },
                  { name: 'specialization', placeholder: 'e.g. Cardiologist', label: 'Specialization' },
                  { name: 'phone', placeholder: '+977 98XXXXXXXX', label: 'Phone' },
                  { name: 'email', placeholder: 'doctor@clinic.com', label: 'Email', type: 'email' },
                ].map(f => (
                  <div key={f.name} className="input-group">
                    <label className="label">{f.label}</label>
                    <input
                      type={f.type || 'text'}
                      className="input-field"
                      placeholder={f.placeholder}
                      required
                      value={docForm[f.name]}
                      onChange={e => setDocForm({ ...docForm, [f.name]: e.target.value })}
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="button-primary" style={{ width: 'auto' }}>Save Doctor</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid-cards">
            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading doctors…</p>
            ) : doctors.length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', gridColumn: '1/-1' }}>
                <ShieldAlert size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p>No doctors added yet. Click "Add New Doctor" to get started.</p>
              </div>
            ) : doctors.map(doc => (
              <div key={doc.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #4f46e5, #818cf8)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {doc.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', background: doc.is_available ? '#dcfce7' : '#fee2e2', color: doc.is_available ? '#15803d' : '#b91c1c' }}>
                    {doc.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', color: '#1e293b' }}>Dr. {doc.name}</h3>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#4f46e5', fontWeight: '600' }}>{doc.specialization}</p>
                <div style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                  <div>📞 {doc.phone}</div>
                  <div>✉️ {doc.email}</div>
                </div>
                <button
                  onClick={() => handleDeleteDoctor(doc.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', borderRadius: '8px', border: '1px solid #fecaca', background: '#fef2f2', color: '#b91c1c', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', width: '100%', justifyContent: 'center', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                >
                  Remove Doctor
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDoctors;
