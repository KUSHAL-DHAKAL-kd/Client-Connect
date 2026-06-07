import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Activity, Calendar, FileText, User, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Booking = () => {
  const { logout } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [suggestedSlots, setSuggestedSlots] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const sidebarLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Activity },
    { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
    { name: 'My Appointments', path: '/patient/appointments', icon: FileText },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  // Standard clinic time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ];

  // Fetch doctors on mount
  useEffect(() => {
    api.get('/api/doctors/')
      .then(res => setDoctors(res.data.filter(d => d.is_available)))
      .catch(() => setError('Failed to load doctors. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const selectedDoctorObj = doctors.find(d => d.id === selectedDoctor);

  // Fetch AI suggestions when doctor and date are selected
  useEffect(() => {
    if (selectedDoctorObj && selectedDate) {
      setAiLoading(true);
      api.get(`/api/ai/suggest-slot/?specialization=${selectedDoctorObj.specialization}&date=${selectedDate}`)
        .then(res => setSuggestedSlots(res.data.suggested_slots || []))
        .catch(() => setSuggestedSlots([])) // silently fail
        .finally(() => setAiLoading(false));
    } else {
      setSuggestedSlots([]);
    }
  }, [selectedDoctorObj, selectedDate]);

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/appointments/create/', {
        doctor: selectedDoctor,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason,
      });
      setSuccess(`Appointment booked with Dr. ${selectedDoctorObj?.name} on ${selectedDate} at ${selectedTime}. Awaiting admin approval.`);
      setSelectedDoctor(null);
      setSelectedTime('');
      setSelectedDate('');
      setReason('');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.detail || 'Booking failed. The slot may already be taken.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Minimum date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="Book Appointment" />

        <div style={{ padding: '0 1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Find a Doctor</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Select a specialist, choose a date, and pick a time slot.</p>
          </div>

          {/* Success / Error banners */}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #bbf7d0', fontWeight: '500' }}>
              <CheckCircle size={20} /> {success}
            </div>
          )}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #fecaca', fontWeight: '500' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Doctors List */}
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Available Specialists</h2>
              {loading ? (
                <p style={{ color: '#94a3b8' }}>Loading doctors…</p>
              ) : doctors.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <p>No available doctors at this time.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {doctors.map(doc => (
                    <div
                      key={doc.id}
                      className="glass-panel"
                      style={{
                        padding: '1.5rem',
                        cursor: 'pointer',
                        border: selectedDoctor === doc.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.7)',
                        boxShadow: selectedDoctor === doc.id ? '0 10px 25px rgba(79, 70, 229, 0.2)' : 'var(--shadow-sm)',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => setSelectedDoctor(doc.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0 }}>
                          {doc.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem' }}>Dr. {doc.name}</h3>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>{doc.specialization}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#eab308', fontWeight: '600' }}>
                            <Star size={14} fill="currentColor" /> Available
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Panel */}
            <div className="glass-panel" style={{ position: 'sticky', top: '2rem', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Book Your Slot</h2>

              {selectedDoctorObj ? (
                <>
                  <div style={{ marginBottom: '1.25rem', background: '#eff6ff', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.875rem', color: '#1e3a8a', fontWeight: '500' }}>
                    Booking with <strong>Dr. {selectedDoctorObj.name}</strong> — {selectedDoctorObj.specialization}
                  </div>

                  {/* Date picker */}
                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label className="label">Select Date</label>
                    <input
                      type="date"
                      className="input-field"
                      min={today}
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>

                  {/* AI Suggestions */}
                  {aiLoading ? (
                    <div style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>Loading AI suggestions…</div>
                  ) : suggestedSlots.length > 0 ? (
                    <div style={{ marginBottom: '1.5rem', background: '#fdfce8', padding: '1rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                      <label className="label" style={{ marginBottom: '0.75rem', display: 'block', color: '#a16207' }}>
                        <Star size={16} fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 
                        AI Recommended Slots
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        {suggestedSlots.map(slot => (
                          <button
                            key={'ai-' + slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            style={{
                              padding: '0.625rem',
                              borderRadius: '8px',
                              border: selectedTime === slot.time ? '2px solid #ca8a04' : '1px solid #fde047',
                              background: selectedTime === slot.time ? '#ca8a04' : 'white',
                              color: selectedTime === slot.time ? 'white' : '#854d0e',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '0.8rem',
                            }}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Time slots */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="label" style={{ marginBottom: '0.75rem', display: 'block' }}>All Available Slots</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: '0.625rem',
                            borderRadius: '8px',
                            border: selectedTime === time ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                            background: selectedTime === time ? 'var(--primary)' : 'white',
                            color: selectedTime === time ? 'white' : '#334155',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.8rem',
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="label">Reason for Visit</label>
                    <textarea
                      className="input-field"
                      placeholder="Briefly describe your symptoms or reason…"
                      rows={3}
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      style={{ resize: 'vertical', paddingLeft: '1rem', paddingTop: '0.75rem' }}
                    />
                  </div>

                  <button
                    className="button-primary"
                    disabled={!selectedTime || !selectedDate || submitting}
                    onClick={handleBooking}
                  >
                    {submitting ? 'Booking…' : <><Clock size={18} /> Confirm Booking</>}
                  </button>
                </>
              ) : (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                  <User size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
                  <p style={{ margin: 0 }}>Select a doctor to see booking options.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
