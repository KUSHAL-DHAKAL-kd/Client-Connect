import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Activity, Calendar, FileText, User, Clock, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const STATUS_STYLES = {
  pending:   { bg: '#fef9c3', text: '#a16207', label: 'Pending' },
  approved:  { bg: '#dcfce7', text: '#15803d', label: 'Approved' },
  cancelled: { bg: '#fee2e2', text: '#b91c1c', label: 'Cancelled' },
  completed: { bg: '#e0e7ff', text: '#4338ca', label: 'Completed' },
};

const AppointmentHistory = () => {
  const { logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  const sidebarLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Activity },
    { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
    { name: 'My Appointments', path: '/patient/appointments', icon: FileText },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  const fetchAppointments = () => {
    setLoading(true);
    api.get('/api/appointments/')
      .then(res => setAppointments(res.data))
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAppointments, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    setError('');
    try {
      await api.delete(`/api/appointments/${id}/`);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="My Appointments" />

        <div style={{ padding: '0 1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Appointment History</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>View and manage all your appointments.</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading appointments…</p>
          ) : appointments.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
              <p style={{ margin: '0 0 1rem 0' }}>No appointment records found.</p>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid white', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.02)', color: '#64748b', fontSize: '0.875rem' }}>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Doctor</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Specialization</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Time</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Reason</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => {
                      const st = STATUS_STYLES[apt.status] || STATUS_STYLES.pending;
                      const canCancel = ['pending', 'approved'].includes(apt.status);
                      return (
                        <tr key={apt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#1e293b' }}>
                            Dr. {apt.doctor_detail?.name || apt.doctor}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: '#475569', fontSize: '0.875rem' }}>
                            {apt.doctor_detail?.specialization || '—'}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>{apt.appointment_date}</td>
                          <td style={{ padding: '1rem 1.5rem', color: '#475569' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={14} /> {apt.appointment_time}
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: '#475569', fontSize: '0.875rem', maxWidth: '200px' }}>
                            {apt.reason || '—'}
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', background: st.bg, color: st.text }}>
                              {st.label}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            {canCancel ? (
                              <button
                                onClick={() => handleCancel(apt.id)}
                                disabled={cancellingId === apt.id}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
                              >
                                <Trash2 size={14} />
                                {cancellingId === apt.id ? 'Cancelling…' : 'Cancel'}
                              </button>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;
