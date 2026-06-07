import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, LogIn, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.non_field_errors?.[0]
        || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left side visual */}
      <div className="auth-visual">
        <HeartPulse size={80} style={{ marginBottom: '2rem', opacity: 0.9 }} />
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1rem' }}>
          Healthcare<br/>Reimagined.
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '400px', lineHeight: 1.6 }}>
          Clinic Connect brings modern technology to your health management. Fast, secure, and beautiful.
        </p>
      </div>

      {/* Right side form */}
      <div className="auth-form-container fadeIn">
        <div className="auth-box">
          <div className="auth-header">
            <Activity size={50} />
            <h1>Welcome Back</h1>
            <p>Please enter your details to sign in.</p>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#b91c1c',
              padding: '0.875rem 1rem', borderRadius: '8px',
              marginBottom: '1rem', fontSize: '0.875rem', fontWeight: '500',
              border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="input-group">
              <label className="label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  id="login-email"
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
              <div className="label">
                <span>Password</span>
                <a href="#" className="text-primary-link" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
                  Forgot password?
                </a>
              </div>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  id="login-password"
                  className="input-field"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="input-icon" />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              className="button-primary"
              style={{ marginTop: '1.5rem', padding: '1.25rem' }}
              disabled={loading}
            >
              {loading ? (
                <span>Signing in…</span>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign Into Dashboard
                </>
              )}
            </button>

            <p className="text-center text-sm mt-4">
              Don't have an account? <Link to="/register" className="text-primary-link">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
