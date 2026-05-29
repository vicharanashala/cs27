export default function TypingIndicator() {
  return (
    <div className="chat-message chat-message-bot">
      <div className="chat-message-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div className="chat-message-content">
        <div className="chat-typing">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}