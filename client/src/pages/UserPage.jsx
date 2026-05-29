import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function UserPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
    fetchAllFAQs();
  }, []);

  const fetchAllFAQs = async () => {
    setFaqsLoading(true);
    try {
      const { data } = await api.get('/faqs?limit=200');
      const grouped = {};
      (data.results || []).forEach(f => {
        const cat = f.category || 'general';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(f);
      });
      setFaqs(Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)));
    } catch {
      setFaqs([]);
    } finally {
      setFaqsLoading(false);
    }
  };

  const searchFAQs = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/faqs/search?q=${encodeURIComponent(q)}`);
      setResults(data.results || []);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchFAQs(val), 250);
  };

  const toggleCategory = (cat) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-container" style={{ flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)', backdropFilter: 'blur(16px)'
      }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Samagama FAQs</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--accent)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff'
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name}</span>
          <button onClick={handleLogout} style={{
            padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            fontSize: 13, background: 'transparent', color: 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'inherit'
          }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--error)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--error)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', padding: '32px 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.3px', marginBottom: 8 }}>How can we help you?</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Search our knowledge base for instant answers</p>
        </div>

        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '4px 16px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search FAQs..."
              value={query}
              onChange={handleInputChange}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                padding: '12px 0', fontSize: 15, color: 'var(--text-primary)',
                fontFamily: 'inherit'
              }}
            />
            {loading && (
              <div style={{ width: 18, height: 18, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            )}
          </div>

          {showResults && results.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              marginTop: 8, maxHeight: 360, overflowY: 'auto', boxShadow: 'var(--shadow-lg)'
            }}>
              {results.map((faq) => (
                <div key={faq._id} style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--accent-light)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{faq.question}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                    <span>{faq.category}</span>
                    <span>{faq.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showResults && query && !loading && results.length === 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              marginTop: 8, padding: 24, textAlign: 'center', color: 'var(--text-muted)',
              fontSize: 14, boxShadow: 'var(--shadow-lg)'
            }}>
              No FAQs match your search
            </div>
          )}
        </div>

        {faqsLoading ? (
          <div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ height: 48, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: 8, animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-card) 50%, var(--bg-secondary) 100%)', backgroundSize: '200% 100%' }} />
            ))}
          </div>
        ) : (
          <div>
            {faqs.map(([cat, items]) => (
              <div key={cat} style={{
                background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                marginBottom: 12, overflow: 'hidden'
              }}>
                <div
                  onClick={() => toggleCategory(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', cursor: 'pointer',
                    fontWeight: 600, fontSize: 15, textTransform: 'capitalize'
                  }}
                >
                  <span>{cat.replace(/-/g, ' ')} ({items.length})</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: expanded[cat] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
                {expanded[cat] && (
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    {items.map((faq) => (
                      <details key={faq._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <summary style={{
                          padding: '14px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                          color: 'var(--text-primary)'
                        }}>
                          {faq.question}
                        </summary>
                        <div style={{ padding: '0 20px 16px', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
