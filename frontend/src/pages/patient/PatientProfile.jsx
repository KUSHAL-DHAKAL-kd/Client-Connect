import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Activity, Calendar, FileText, User, Mail, Phone, ShieldCheck, Heart, AlertCircle, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const PatientProfile = () => {
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    date_of_birth: '',
    blood_group: '',
    gender: '',
    emergency_contact: ''
  });

  const sidebarLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Activity },
    { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
    { name: 'My Appointments', path: '/patient/appointments', icon: FileText },
    { name: 'Profile', path: '/patient/profile', icon: User },
  ];

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/patients/me/');
      setProfile(res.data);
      setFormData({
        phone: res.data.user_detail?.phone || '',
        date_of_birth: res.data.date_of_birth || '',
        blood_group: res.data.blood_group || '',
        gender: res.data.gender || '',
        emergency_contact: res.data.emergency_contact || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/patients/me/', {
        user: { phone: formData.phone },
        date_of_birth: formData.date_of_birth,
        blood_group: formData.blood_group,
        gender: formData.gender,
        emergency_contact: formData.emergency_contact
      });
      await fetchProfile();
      setEditing(false);
    } catch (err) {
      alert('Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="My Profile" />

        <div style={{ padding: '0 1rem', maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, var(--primary), #6366f1)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', margin: '0 auto 1rem auto', boxShadow: 'var(--shadow-glow)' }}>
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'PT'}
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{user?.username || 'Patient'}</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#10b981" /> Verified Patient Account
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>Account Details</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  <Edit3 size={16} /> Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    <X size={16} /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading profile data...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* Email (Read Only) */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <Mail size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</p>
                    <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{user?.email || 'Not provided'}</p>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                    <Phone size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Phone Number</p>
                    {editing ? (
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field" style={{ padding: '0.5rem', marginTop: '0.25rem' }} />
                    ) : (
                      <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{profile?.user_detail?.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* DOB */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    <Calendar size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date of Birth</p>
                    {editing ? (
                      <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="input-field" style={{ padding: '0.5rem', marginTop: '0.25rem' }} />
                    ) : (
                      <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{profile?.date_of_birth || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                    <User size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Gender</p>
                    {editing ? (
                      <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" style={{ padding: '0.5rem', marginTop: '0.25rem' }}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{profile?.gender || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Blood Group */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                    <Heart size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Blood Group</p>
                    {editing ? (
                      <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="input-field" style={{ padding: '0.5rem', marginTop: '0.25rem' }}>
                        <option value="">Select Blood Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    ) : (
                      <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{profile?.blood_group || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(234, 88, 12, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                    <AlertCircle size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Emergency Contact</p>
                    {editing ? (
                      <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} className="input-field" style={{ padding: '0.5rem', marginTop: '0.25rem' }} placeholder="Phone number" />
                    ) : (
                      <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>{profile?.emergency_contact || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
