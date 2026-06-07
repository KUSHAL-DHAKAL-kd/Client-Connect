import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, UserPlus, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', phone: '', role: 'patient',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(formData);
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        setError(messages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left side visual */}
      <div className="auth-visual" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.9) 0%, rgba(79, 70, 229, 0.9) 100%)' }}>
        <ShieldCheck size={80} style={{ marginBottom: '2rem', opacity: 0.9 }} />
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
          Secure.<br/>Private.<br/>Safe.
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '400px', lineHeight: 1.6 }}>
          Join thousands of patients managing their health records and appointments with peace of mind.
        </p>
      </div>

      {/* Right side form */}
      <div className="auth-form-container fadeIn">
        <div className="auth-box">
          <div className="auth-header">
            <Activity size={50} />
            <h1>Create Account</h1>
            <p>Join Clinic Connect to manage your health.</p>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#b91c1c', padding: '0.875rem 1rem',
              borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem',
              fontWeight: '500', border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#dcfce7', color: '#15803d', padding: '0.875rem 1rem',
              borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem',
              fontWeight: '500', border: '1px solid #bbf7d0',
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="input-group">
              <label className="label">Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  id="register-username"
                  className="input-field"
                  placeholder="e.g. john_doe"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
                <User className="input-icon" />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  id="register-email"
                  className="input-field"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="input-icon" />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Phone Number</label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  id="register-phone"
                  className="input-field"
                  placeholder="+977 98XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Phone className="input-icon" />
              </div>
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  id="register-password"
                  className="input-field"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="input-icon" />
              </div>
            </div>

            <button
              type="submit"
              id="register-submit"
              className="button-primary"
              style={{ marginTop: '1.5rem', padding: '1.25rem' }}
              disabled={loading}
            >
              {loading ? <span>Creating account…</span> : <><UserPlus size={20} /> Create Account</>}
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account? <Link to="/login" className="text-primary-link">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
