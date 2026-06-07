import React from 'react';
import { Bell, User, Search, Menu } from 'lucide-react';

const Navbar = ({ title = "Dashboard" }) => {
  return (
    <nav className="nav-pill">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{title}</h2>
      </div>
      
      <div style={{ flex: 1, maxWidth: '400px', margin: '0 2rem' }}>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Quick search..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: '100px',
              padding: '0.6rem 1rem 0.6rem 2.5rem',
              fontSize: '0.875rem',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
          />
          <Search className="input-icon" />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#475569' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'inherit' }}>
          <Bell size={22} />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Alex Freeman</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>Administrator</p>
          </div>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(to bottom right, #818cf8, #4f46e5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(79,70,229,0.3)' }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
