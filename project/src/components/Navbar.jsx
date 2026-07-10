import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const close = () => setMenuOpen(false);

  const handleLogout = () => { logout(); close(); navigate("/"); };

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/restaurants", label: "Restaurants" },
    { to: "/offers", label: "Offers" },
  ];

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-logo">F</span>
          <span className="brand-name">Food<span className="brand-accent">Hub</span></span>
        </Link>
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={close}>{n.label}</NavLink>
          ))}
          <NavLink to="/cart" className="nav-link nav-icon-link" onClick={close}>
            <span className="nav-icon">🛒</span><span className="hide-mobile">Cart</span>
            {count > 0 && <span className="nav-badge">{count}</span>}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className="nav-link" onClick={close}>
                <span className="nav-icon">👤</span><span className="hide-mobile">{user.username}</span>
                {favorites.length > 0 && <span className="nav-badge nav-badge-fav">♥</span>}
              </NavLink>
              <button className="nav-link nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={close}>Login</NavLink>
              <NavLink to="/signup" className="nav-link" onClick={close}>Sign Up</NavLink>
            </>
          )}
        </nav>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
            <span className={menuOpen ? "open" : ""} />
          </button>
        </div>
      </div>
    </header>
  );
}
