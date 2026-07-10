import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar({ variant = "hero" }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("restaurants");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setFocused(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/restaurants?q=${encodeURIComponent(query.trim())}&type=${type}`); setFocused(false); }
  };

  return (
    <form className={`searchbar searchbar-${variant}`} onSubmit={handleSubmit} ref={boxRef} role="search">
      <div className="searchbar-types">
        {["restaurants","dishes","locations"].map((t) => (
          <button type="button" key={t} className={`searchbar-type ${type === t ? "active" : ""}`} onClick={() => setType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="searchbar-input-row">
        <span className="searchbar-icon" aria-hidden="true">🔍</span>
        <input type="text" className="searchbar-input" placeholder={`Search for ${type}…`} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} aria-label={`Search ${type}`} />
        <button type="submit" className="searchbar-btn btn btn-primary">Search</button>
      </div>
      {focused && query && (
        <div className="searchbar-hint">Press <kbd>Enter</kbd> to see {type} matching <strong>“{query}”</strong></div>
      )}
    </form>
  );
}
