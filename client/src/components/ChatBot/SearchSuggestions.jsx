export default function SearchSuggestions({ suggestions, loading, onSelect, visible }) {
  if (!visible || suggestions.length === 0) return null;

  if (loading) {
    return (
      <div className="search-suggestions">
        <div className="search-suggestion-skeleton">
          <div className="skeleton-line" style={{ width: '70%', height: '14px', marginBottom: '8px' }} />
          <div className="skeleton-line" style={{ width: '50%', height: '14px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="search-suggestions">
      {suggestions.map((s) => (
        <button
          key={s._id || s.question}
          className="search-suggestion-item"
          onClick={() => onSelect(s)}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-suggestion-icon">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="search-suggestion-text">{s.question}</span>
          <span className={`search-suggestion-score ${s._overview ? 'suggestion-overview' : ''}`}>{s.category}</span>
        </button>
      ))}
    </div>
  );
}