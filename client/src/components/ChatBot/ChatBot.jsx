import { useState, useRef, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import ChatMessage from './ChatMessage';
import SearchSuggestions from './SearchSuggestions';
import TypingIndicator from './TypingIndicator';
import '../../styles/chatbot.css';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m the NeuralDesk Assistant. Ask me anything about our platform.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const { data } = await api.get(`/faqs/search?q=${encodeURIComponent(query)}`);
      setSuggestions(data.results || []);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 250);
  };

  const handleSelectSuggestion = async (suggestion) => {
    setShowSuggestions(false);
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', text: suggestion.question }]);
    setLoading(true);

    try {
      if (suggestion._overview) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: suggestion.answer,
            faq: {
              question: suggestion.question,
              category: 'Program Overview',
              views: 0,
            },
            noMatch: false,
          },
        ]);
      } else {
        const { data } = await api.get(`/faqs/${suggestion._id}`);
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: data.faq.answer,
            faq: {
              question: data.faq.question,
              category: data.faq.category,
              views: data.faq.views,
            },
            noMatch: false,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.', noMatch: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.get(`/faqs/search?q=${encodeURIComponent(text)}`);

      if (data.results && data.results.length > 0) {
        const best = data.results[0];
        if (best._overview) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'bot',
              text: best.answer,
              faq: {
                question: best.question,
                category: 'Program Overview',
                views: 0,
              },
              noMatch: false,
            },
          ]);
          return;
        }
        const { data: faqData } = await api.get(`/faqs/${best._id}`);
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            text: faqData.faq.answer,
            faq: {
              question: faqData.faq.question,
              category: faqData.faq.category,
              views: faqData.faq.views,
            },
            noMatch: false,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: '', noMatch: true },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong. Please try again.', noMatch: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="neural-chatbot">
      <div className="neural-chatbot-header">
        <div className="neural-chatbot-header-left">
          <div className="neural-chatbot-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div className="neural-chatbot-title">NeuralDesk Assistant</div>
            <div className="neural-chatbot-status">Online</div>
          </div>
        </div>
      </div>

      <div className="neural-chatbot-body">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="neural-chatbot-input-area">
        <SearchSuggestions
          suggestions={suggestions}
          loading={suggestionsLoading}
          visible={showSuggestions && input.trim().length > 0}
          onSelect={handleSelectSuggestion}
        />
        <form className="neural-chatbot-form" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            className="neural-chatbot-input"
            placeholder="Ask a question..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={300}
            autoComplete="off"
          />
          <button
            type="submit"
            className="neural-chatbot-send"
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}