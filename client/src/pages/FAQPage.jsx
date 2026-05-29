import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ChatBot from '../components/ChatBot/ChatBot';
import '../styles/chatbot.css';

export default function FAQPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchTrending = useCallback(async () => {
    setTrendingLoading(true);
    try {
      const { data } = await api.get('/faqs/trending');
      setTrending(data.results || []);
    } catch {
      setTrending([]);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/faqs/categories');
      setCategories(data.categories || []);
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    fetchCategories();
  }, [fetchTrending, fetchCategories]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="neural-faq-page">
      <header className="neural-faq-header">
        <div className="neural-faq-header-inner">
          <div className="neural-faq-logo" onClick={() => navigate('/faq-hub')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            NeuralDesk FAQ
          </div>
          <div className="neural-faq-header-right">
            <button className="neural-faq-nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className="neural-faq-nav-btn" onClick={() => navigate('/query')}>Ask a Question</button>
            <div className="neural-faq-user">
              <div className="neural-faq-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
              <span className="neural-faq-user-name">{user?.name}</span>
            </div>
            <button className="neural-faq-logout" onClick={handleLogout} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="neural-faq-main">
        <div className="neural-faq-layout">
          <div className="neural-faq-chat-section">
            <div className="neural-faq-hero">
              <h1 className="neural-faq-title">How can we help you?</h1>
              <p className="neural-faq-subtitle">
                Search our knowledge base for instant answers.
              </p>
            </div>
            <ChatBot />
          </div>

          <aside className="neural-faq-sidebar">
            <div className="neural-faq-sidebar-card">
              <div className="neural-faq-sidebar-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
                Trending FAQs
              </div>
              <div className="neural-faq-sidebar-body">
                {trendingLoading ? (
                  <div className="neural-faq-sidebar-loading">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton-line" style={{ width: '100%', height: '36px', marginBottom: '8px', borderRadius: '8px' }} />
                    ))}
                  </div>
                ) : trending.length === 0 ? (
                  <div className="neural-faq-sidebar-empty">
                    <p>No trending FAQs yet.</p>
                  </div>
                ) : (
                  <div className="neural-faq-sidebar-list">
                    {trending.map((faq) => (
                      <div key={faq._id} className="neural-faq-sidebar-item">
                        <div className="neural-faq-sidebar-item-q">{faq.question}</div>
                        <div className="neural-faq-sidebar-item-meta">
                          <span className="neural-faq-sidebar-item-cat">{faq.category}</span>
                          <span className="neural-faq-sidebar-item-views">{faq.views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {categories.length > 0 && (
              <div className="neural-faq-sidebar-card">
                <div className="neural-faq-sidebar-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Categories
                </div>
                <div className="neural-faq-sidebar-body">
                  <div className="neural-faq-category-list">
                    {categories.map((cat) => (
                      <span key={cat} className="neural-faq-category-chip">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
