import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { Users, Activity, ShieldAlert, FileText, Settings, User, RefreshCw, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const AdminReports = () => {
  const { logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const sidebarLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: Activity },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Doctors', path: '/admin/doctors', icon: ShieldAlert },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  const fetchReports = () => {
    setLoading(true);
    api.get('/api/reports/')
      .then(res => setReports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchReports, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/api/reports/generate/');
      fetchReports();
    } catch (err) {
      alert('Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  // Group reports by date
  const groupedReports = reports.reduce((acc, rep) => {
    if (!acc[rep.report_date]) acc[rep.report_date] = [];
    acc[rep.report_date].push(rep);
    return acc;
  }, {});

  return (
    <div className="app-layout">
      <Sidebar links={sidebarLinks} onLogout={logout} />
      <main className="main-content fadeIn">
        <Navbar title="Daily Reports" />
        <div style={{ padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>Analytics & Reports</h1>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Track clinic performance and daily appointment statistics.</p>
            </div>
            <button 
              onClick={handleGenerate} 
              disabled={generating}
              className="button-primary" 
              style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#4f46e5' }}
            >
              <RefreshCw size={18} className={generating ? 'spin' : ''} /> 
              {generating ? 'Generating...' : 'Generate Today\'s Report'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: '2rem' }}>
            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading reports…</p>
            ) : Object.keys(groupedReports).length === 0 ? (
              <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                <BarChart2 size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p>No reports generated yet. Click the button above to snapshot today's data.</p>
              </div>
            ) : (
              Object.keys(groupedReports).map(date => {
                const dateReports = groupedReports[date];
                const totalAppts = dateReports.reduce((sum, r) => sum + r.total_appointments, 0);
                const totalComp = dateReports.reduce((sum, r) => sum + r.completed_appointments, 0);
                const totalCanc = dateReports.reduce((sum, r) => sum + r.cancelled_appointments, 0);

                return (
                  <div key={date} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
                        Report for {date}
                      </h2>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                        <span style={{ color: '#475569', fontWeight: '600' }}>Total: {totalAppts}</span>
                        <span style={{ color: '#15803d', fontWeight: '600' }}>Completed: {totalComp}</span>
                        <span style={{ color: '#b91c1c', fontWeight: '600' }}>Cancelled: {totalCanc}</span>
                      </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {dateReports.map(rep => (
                          <div key={rep.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#334155', marginBottom: '1rem' }}>
                              Dr. {rep.doctor_detail?.name || rep.doctor}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#64748b' }}>
                                  <span>Total Appointments</span>
                                  <span style={{ fontWeight: '600', color: '#334155' }}>{rep.total_appointments}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: '100%', height: '100%', background: '#94a3b8' }}></div>
                                </div>
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#64748b' }}>
                                  <span>Completed</span>
                                  <span style={{ fontWeight: '600', color: '#15803d' }}>{rep.completed_appointments}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#dcfce7', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${rep.total_appointments ? (rep.completed_appointments / rep.total_appointments) * 100 : 0}%`, height: '100%', background: '#22c55e' }}></div>
                                </div>
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#64748b' }}>
                                  <span>Cancelled</span>
                                  <span style={{ fontWeight: '600', color: '#b91c1c' }}>{rep.cancelled_appointments}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: '#fee2e2', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${rep.total_appointments ? (rep.cancelled_appointments / rep.total_appointments) * 100 : 0}%`, height: '100%', background: '#ef4444' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
