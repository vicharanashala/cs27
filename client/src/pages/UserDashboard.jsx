import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get('/faqs?limit=200');
      setFaqs(data.results || []);
    } catch {
      setFaqs([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFAQs(); }, [fetchFAQs]);

  const catCounts = useMemo(() => {
    const map = {};
    faqs.forEach(f => { map[f.category] = (map[f.category] || 0) + 1; });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [faqs]);

  const totalViews = useMemo(() => faqs.reduce((s, f) => s + (f.views || 0), 0), [faqs]);

  return (
    <div style={{ minHeight: '100vh', background: '#080d1a', color: '#f0f4ff', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: 'rgba(13,22,48,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,229,192,0.15)', position: 'sticky', top: 0, zIndex: 40
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 700, color: '#f0f4ff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5c0" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            NeuralDesk
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/faq-hub')} style={{
              padding: '7px 16px', border: '1px solid rgba(0,229,192,0.15)', borderRadius: 8,
              fontSize: 13, fontWeight: 600, background: 'transparent', color: '#7a8ab0',
              cursor: 'pointer', fontFamily: 'inherit'
            }} onMouseOver={e => { e.target.style.borderColor = '#00e5c0'; e.target.style.color = '#00e5c0'; e.target.style.background = 'rgba(0,229,192,0.08)'; }}
              onMouseOut={e => { e.target.style.borderColor = 'rgba(0,229,192,0.15)'; e.target.style.color = '#7a8ab0'; e.target.style.background = 'transparent'; }}>
              FAQ Hub
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00e5c0', color: '#080d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</span>
            </div>
            <button onClick={async () => { await logout(); navigate('/login', { replace: true }); }} style={{
              width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(0,229,192,0.15)',
              background: 'transparent', color: '#7a8ab0', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }} onMouseOver={e => { e.target.style.background = 'rgba(220,38,38,0.1)'; e.target.style.color = '#ef4444'; e.target.style.borderColor = '#ef4444'; }}
              onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = '#7a8ab0'; e.target.style.borderColor = 'rgba(0,229,192,0.15)'; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 900, margin: '0 auto', width: '100%', padding: '0 24px 60px' }}>
        <div style={{ padding: '48px 0 32px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: '#7a8ab0', fontSize: 15, marginBottom: 32 }}>
            NeuralDesk Knowledge Platform
          </p>

          {error ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#7a8ab0' }}>
              <p>Could not load data. <button onClick={fetchFAQs} style={{ background: 'none', border: 'none', color: '#00e5c0', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>Retry</button></p>
            </div>
          ) : loading ? (
            <div>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-line" style={{ width: '100%', height: '60px', marginBottom: '12px', borderRadius: 10 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
              <div style={{ background: 'rgba(13,22,48,0.85)', border: '1px solid rgba(0,229,192,0.15)', borderRadius: 12, padding: 24, backdropFilter: 'blur(16px)' }}>
                <div style={{ fontSize: 11, color: '#7a8ab0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total FAQs</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#00e5c0' }}>{faqs.length}</div>
              </div>
              <div style={{ background: 'rgba(13,22,48,0.85)', border: '1px solid rgba(0,229,192,0.15)', borderRadius: 12, padding: 24, backdropFilter: 'blur(16px)' }}>
                <div style={{ fontSize: 11, color: '#7a8ab0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Categories</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#00e5c0' }}>{catCounts.length}</div>
              </div>
              <div style={{ background: 'rgba(13,22,48,0.85)', border: '1px solid rgba(0,229,192,0.15)', borderRadius: 12, padding: 24, backdropFilter: 'blur(16px)' }}>
                <div style={{ fontSize: 11, color: '#7a8ab0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total Views</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#00e5c0' }}>{totalViews}</div>
              </div>
            </div>
          )}

          {!loading && !error && catCounts.length > 0 && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Categories</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {catCounts.map(([cat, count]) => (
                  <div key={cat} onClick={() => navigate('/faq-hub')} style={{
                    padding: '10px 18px', background: 'rgba(13,22,48,0.85)', border: '1px solid rgba(0,229,192,0.15)',
                    borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all 200ms ease'
                  }} onMouseOver={e => { e.target.style.borderColor = '#00e5c0'; e.target.style.background = 'rgba(0,229,192,0.08)'; }}
                    onMouseOut={e => { e.target.style.borderColor = 'rgba(0,229,192,0.15)'; e.target.style.background = 'rgba(13,22,48,0.85)'; }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                      {cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                    <span style={{ fontSize: 12, color: '#7a8ab0', fontWeight: 500, background: '#080d1a', padding: '2px 8px', borderRadius: 8 }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', paddingTop: 16 }}>
          <button onClick={() => navigate('/faq-hub')} style={{
            padding: '12px 32px', border: 'none', borderRadius: 10, fontSize: 15,
            fontWeight: 700, background: '#00e5c0', color: '#080d1a', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 200ms ease'
          }} onMouseOver={e => { e.target.style.boxShadow = '0 0 24px rgba(0,229,192,0.3)'; }}
            onMouseOut={e => { e.target.style.boxShadow = 'none'; }}>
            Open FAQ Hub
          </button>
        </div>
      </main>
    </div>
  );
}
