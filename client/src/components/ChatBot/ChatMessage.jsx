export default function ChatMessage({ message }) {
  const isBot = message.role === 'bot';

  return (
    <div className={`chat-message ${isBot ? 'chat-message-bot' : 'chat-message-user'}`}>
      {isBot && (
        <div className="chat-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      )}
      <div className={`chat-message-content ${isBot ? '' : 'chat-message-content-user'}`}>
        <div className="chat-message-text">{message.text}</div>
        {isBot && message.faq && (
          <div className="chat-message-faq">
            <div className="chat-faq-item">
              <span className="chat-faq-label">Category</span>
              <span className="chat-faq-value">{message.faq.category}</span>
            </div>
            <div className="chat-faq-item">
              <span className="chat-faq-label">Views</span>
              <span className="chat-faq-value">{message.faq.views}</span>
            </div>
          </div>
        )}
        {isBot && message.noMatch && (
          <div className="chat-no-match">
            <p>No FAQ found.</p>
            <p>Your question may be supported in a future version of NeuralDesk.</p>
            <p>Try searching with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}