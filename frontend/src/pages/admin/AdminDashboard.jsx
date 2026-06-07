import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Users, Activity, Calendar, FileText, Settings, ShieldAlert, TrendingUp, CheckCircle, XCircle, Plus, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const STATUS_STYLES = {
  pending:   { bg: '#fef9c3', text: '#a16207' },
  approved:  { bg: '#dcfce7', text: '#15803d' },
  cancelled: { bg: '#fee2e2', text: '#b91c1c' },
  completed: { bg: '#e0e7ff', text: '#4338ca' },
};

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // Doctor form state
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', specialization: '', phone: '', email: '' });
  const [docFormError, setDocFormError] = useState('');

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Patients', path: '#', icon: Users },
    { name: 'Doctors', path: '#', icon: ShieldAlert },
    { name: 'Reports', path: '#', icon: FileText },
    { name: 'Settings', path: '#', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/api/appointments/'),
      api.get('/api/doctors/'),
    ]).then(([apptRes, docRes]) => {
      setAppointments(apptRes.data);
      setDoctors(docRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/api/appointments/${id}/approve/`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve.');
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    setActionId(id);
    try {
      await api.patch(`/api/appointments/${id}/cancel/`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel.');
    } finally {
      setActionId(null);
    }
  };

  const handleComplete = async (id) => {
    setActionId(id);
    try {
      await api.patch(`/api/appointments/${id}/complete/`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark complete.');
    } finally {
      setActionId(null);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setDocFormError('');
    try {
      await api.post('/api/doctors/create/', docForm);
      setShowDoctorForm(false);
      setDocForm({ name: '', specialization: '', phone: '', email: '' });
      fetchData();
    } catch (err) {
      const data = err.response?.data;
      setDocFormError(data ? Object.values(data).flat().join(' | ') : 'Failed to add doctor.');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Delete this doctor? This cannot be undone.')) return;
    try {
      await api.delete(`/api/doctors/${id}/`);
      fetchData();
    } catch {
      alert('Failed to delete doctor.');
    }
  };

  // Stats
  const totalAppts = appointments.length;
  const pendingAppts = appointments.filter(a => a.status === 'pending').length;
  const totalDoctors = doctors.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === todayStr).length;

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none',
        background: activeTab === id ? 'var(--primary)' : 'transparent',
        color: activeTab === id ? 'white' : '#64748b',
        fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
        fontSize: '0.875rem',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="Admin Portal" />

        <div style={{ padding: '0 1rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>System Overview</h1>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Monitor clinic operations and manage everything.</p>
            </div>
            <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>
              <Calendar size={16} color="var(--primary)" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid-cards">
            {[
              { label: 'Total Appointments', value: totalAppts, bg: '#e0e7ff', color: '#4f46e5', Icon: Calendar },
              { label: 'Active Doctors', value: totalDoctors, bg: '#fae8ff', color: '#c026d3', Icon: ShieldAlert },
              { label: "Today's Appointments", value: todayAppts, bg: '#ffedd5', color: '#ea580c', Icon: Activity },
              { label: 'Pending Approval', value: pendingAppts, bg: '#fef9c3', color: '#a16207', Icon: TrendingUp },
            ].map(({ label, value, bg, color, Icon }) => (
              <div key={label} className="glass-panel" style={{ padding: '1.5rem', border: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: bg, color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} />
                  </div>
                </div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>{label}</h3>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#1e293b' }}>{loading ? '—' : value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.6)', padding: '0.375rem', borderRadius: '10px', width: 'fit-content', border: '1px solid white' }}>
            <TabBtn id="appointments" label="Appointments" />
            <TabBtn id="doctors" label="Doctors" />
          </div>

          {/* ── Appointments tab ── */}
          {activeTab === 'appointments' && (
            <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid white', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b' }}>All Appointments</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.02)', color: '#64748b', fontSize: '0.875rem' }}>
                      {['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading…</td></tr>
                    ) : appointments.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No appointments yet.</td></tr>
                    ) : appointments.map(apt => {
                      const st = STATUS_STYLES[apt.status] || STATUS_STYLES.pending;
                      return (
                        <tr key={apt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <td style={{ padding: '0.875rem 1.25rem', fontWeight: '600', color: '#1e293b' }}>
                            {apt.patient_detail?.username || apt.patient}
                          </td>
                          <td style={{ padding: '0.875rem 1.25rem', color: '#475569' }}>
                            Dr. {apt.doctor_detail?.name || apt.doctor}
                          </td>
                          <td style={{ padding: '0.875rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>{apt.appointment_date}</td>
                          <td style={{ padding: '0.875rem 1.25rem', color: '#475569', fontSize: '0.875rem' }}>{apt.appointment_time}</td>
                          <td style={{ padding: '0.875rem 1.25rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', background: st.bg, color: st.text }}>
                              {apt.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 1.25rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {apt.status === 'pending' && (
                                <button onClick={() => handleApprove(apt.id)} disabled={actionId === apt.id}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#dcfce7', color: '#15803d', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem' }}>
                                  <CheckCircle size={13} /> Approve
                                </button>
                              )}
                              {apt.status === 'approved' && (
                                <button onClick={() => handleComplete(apt.id)} disabled={actionId === apt.id}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #c7d2fe', background: '#e0e7ff', color: '#4338ca', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem' }}>
                                  ✓ Complete
                                </button>
                              )}
                              {['pending', 'approved'].includes(apt.status) && (
                                <button onClick={() => handleCancel(apt.id)} disabled={actionId === apt.id}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #fecaca', background: '#fee2e2', color: '#b91c1c', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem' }}>
                                  <XCircle size={13} /> Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Doctors tab ── */}
          {activeTab === 'doctors' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold' }}>Doctor Profiles</h2>
                <button onClick={() => setShowDoctorForm(!showDoctorForm)} className="button-primary" style={{ width: 'auto' }}>
                  <Plus size={16} /> Add Doctor
                </button>
              </div>

              {/* Add doctor form */}
              {showDoctorForm && (
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0' }}>New Doctor Profile</h3>
                  {docFormError && <div style={{ color: '#b91c1c', marginBottom: '0.75rem', fontSize: '0.875rem' }}>{docFormError}</div>}
                  <form onSubmit={handleAddDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="button-primary" style={{ width: 'auto' }}>Save Doctor</button>
                      <button type="button" onClick={() => setShowDoctorForm(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Doctors grid */}
              <div className="grid-cards">
                {loading ? (
                  <p style={{ color: '#94a3b8' }}>Loading doctors…</p>
                ) : doctors.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', gridColumn: '1/-1' }}>
                    <p>No doctors added yet. Click "Add Doctor" to get started.</p>
                  </div>
                ) : doctors.map(doc => (
                  <div key={doc.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        {doc.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', background: doc.is_available ? '#dcfce7' : '#fee2e2', color: doc.is_available ? '#15803d' : '#b91c1c' }}>
                        {doc.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Dr. {doc.name}</h3>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>{doc.specialization}</p>
                    <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#94a3b8' }}>{doc.email}</p>
                    <button
                      onClick={() => handleDeleteDoctor(doc.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '6px', border: '1px solid #fecaca', background: 'white', color: '#b91c1c', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
                    >
                      Remove Doctor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
