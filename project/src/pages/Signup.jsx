import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "./Auth.css";

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.username.trim().length < 3) e.username = "Username must be at least 3 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await signup(form);
    if (!res.ok) {
      toast(res.error, "error");
      setErrors({ form: res.error });
    } else {
      toast("Account created. Welcome to FoodHub!", "success");
      navigate(redirectTo);
    }
  };

  const handleGoogleSignIn = () => {
    toast("Continue with Google is not enabled yet.", "info");
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-side">
          <h2>Join FoodHub 🍔</h2>
          <p>Create an account to start ordering from the best restaurants near you.</p>
          <ul className="auth-perks"><li>✓ Free to join</li><li>✓ Save your favourites</li><li>✓ Order in seconds</li></ul>
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1>Sign up</h1>
          {errors.form && <div className="auth-banner">{errors.form}</div>}
          <div className={`field ${errors.username ? "field-error" : ""}`}>
            <label>Username</label><input value={form.username} onChange={set("username")} placeholder="your name" />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>
          <div className={`field ${errors.email ? "field-error" : ""}`}>
            <label>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className={`field ${errors.password ? "field-error" : ""}`}>
            <label>Password</label><input type="password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg">Create account</button>
          <button type="button" className="btn btn-outline btn-block auth-google-btn" onClick={handleGoogleSignIn}>
            <span className="google-icon">G</span>
            <span>Continue with Google</span>
          </button>
          <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
