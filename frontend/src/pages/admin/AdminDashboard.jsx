import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Users, Activity, Calendar, FileText, Settings, ShieldAlert, TrendingUp, CheckCircle, XCircle, User } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Doctors', path: '/admin/doctors', icon: ShieldAlert },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
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

  // Stats
  const totalAppts = appointments.length;
  const pendingAppts = appointments.filter(a => a.status === 'pending').length;
  const totalDoctors = doctors.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === todayStr).length;

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
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Monitor clinic operations and manage pending appointments.</p>
            </div>
            <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>
              <Calendar size={16} color="var(--primary)" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid-cards" style={{ marginBottom: '2.5rem' }}>
            {[
              { label: 'Total Appointments', value: totalAppts, bg: '#e0e7ff', color: '#4f46e5', Icon: Calendar },
              { label: 'Active Doctors', value: totalDoctors, bg: '#fae8ff', color: '#c026d3', Icon: ShieldAlert },
              { label: "Today's Appointments", value: todayAppts, bg: '#ffedd5', color: '#ea580c', Icon: Activity },
              { label: 'Pending Approval', value: pendingAppts, bg: '#fef9c3', color: '#a16207', Icon: TrendingUp },
            ].map(({ label, value, bg, color, Icon }) => (
              <div key={label} className="glass-panel" style={{ padding: '1.5rem', border: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
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

          {/* Appointments Table */}
          <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid white', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="var(--primary)" /> Recent Appointments
              </h2>
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
                      <tr key={apt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
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
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#dcfce7', color: '#15803d', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' }}>
                                <CheckCircle size={13} /> Approve
                              </button>
                            )}
                            {apt.status === 'approved' && (
                              <button onClick={() => handleComplete(apt.id)} disabled={actionId === apt.id}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #c7d2fe', background: '#e0e7ff', color: '#4338ca', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' }}>
                                ✓ Complete
                              </button>
                            )}
                            {['pending', 'approved'].includes(apt.status) && (
                              <button onClick={() => handleCancel(apt.id)} disabled={actionId === apt.id}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #fecaca', background: '#fee2e2', color: '#b91c1c', fontWeight: '600', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.2s' }}>
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
