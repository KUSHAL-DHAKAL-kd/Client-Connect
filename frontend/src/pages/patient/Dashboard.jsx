import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Calendar, Activity, Clock, FileText, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const STATUS_COLORS = {
  pending:   { bg: '#fef9c3', text: '#a16207' },
  approved:  { bg: '#dcfce7', text: '#15803d' },
  cancelled: { bg: '#fee2e2', text: '#b91c1c' },
  completed: { bg: '#e0e7ff', text: '#4338ca' },
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Activity },
    { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
    { name: 'My Appointments', path: '/patient/appointments', icon: FileText },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  useEffect(() => {
    api.get('/api/appointments/')
      .then(res => setAppointments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = appointments.filter(a => ['pending', 'approved'].includes(a.status));
  const totalAppts = appointments.length;
  const completedAppts = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="My Dashboard" />

        <div style={{ padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                Hello, {user?.username || 'Patient'} 👋
              </h1>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Here is your appointment overview.</p>
            </div>
            <button onClick={() => navigate('/patient/book')} className="button-primary" style={{ width: 'auto' }}>
              <Calendar size={18} /> Book New Appointment
            </button>
          </div>

          {/* Stats */}
          <div className="grid-cards">
            <div className="glass-panel" style={{ borderLeft: '4px solid #3b82f6', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Calendar size={24} />
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Total Appointments</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{totalAppts}</p>
              </div>
            </div>

            <div className="glass-panel" style={{ borderLeft: '4px solid #10b981', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <Activity size={24} />
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Completed</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{completedAppts}</p>
              </div>
            </div>

            <div className="glass-panel" style={{ borderLeft: '4px solid #8b5cf6', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', background: '#f5f3ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
                <Clock size={24} />
              </div>
              <div>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Upcoming</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{upcoming.length}</p>
              </div>
            </div>
          </div>

          {/* Upcoming appointments */}
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Upcoming Appointments</h2>

          {loading ? (
            <p style={{ color: '#94a3b8' }}>Loading appointments…</p>
          ) : upcoming.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>No upcoming appointments.</p>
              <button onClick={() => navigate('/patient/book')} className="button-primary" style={{ width: 'auto', marginTop: '1rem' }}>
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {upcoming.map(appt => {
                const colors = STATUS_COLORS[appt.status];
                const dateObj = new Date(appt.appointment_date);
                return (
                  <div key={appt.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '56px', height: '56px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {dateObj.toLocaleString('default', { month: 'short' })}
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', lineHeight: 1 }}>
                          {dateObj.getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem' }}>
                          Dr. {appt.doctor_detail?.name || appt.doctor}
                        </h3>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                          {appt.doctor_detail?.specialization}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#2563eb', fontWeight: '600' }}>
                            <Clock size={14} /> {appt.appointment_time}
                          </div>
                          <span style={{ padding: '0.15rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 'bold', background: colors.bg, color: colors.text }}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight color="#cbd5e1" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
