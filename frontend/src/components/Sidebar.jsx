import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';

const Sidebar = ({ links, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar-wrapper">
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Activity color="var(--primary)" size={32} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', margin: 0 }}>Clinic Connect</h1>
      </div>
      <div style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Menu Navigation</h2>
      </div>
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              borderRadius: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: isActive ? 'linear-gradient(to right, var(--primary), #6366f1)' : 'transparent',
              color: isActive ? 'white' : '#475569',
              boxShadow: isActive ? '0 4px 10px rgba(79, 70, 229, 0.3)' : 'none',
              transform: isActive ? 'translateX(4px)' : 'none'
            })}
          >
            {({ isActive }) => (
              <>
                {link.icon && <link.icon size={22} color={isActive ? 'white' : '#94a3b8'} />}
                {link.name}
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.4)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #fecaca', background: '#fee2e2', color: '#b91c1c', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', width: '100%', justifyContent: 'center' }}
        >
          <LogOut size={18} /> Logout
        </button>
        <div style={{ background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid white' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', margin: '0 0 0.5rem 0' }}>Need help?</p>
          <p style={{ fontSize: '0.875rem', color: '#334155', fontWeight: '500', margin: 0 }}>Contact our 24/7 support line.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
