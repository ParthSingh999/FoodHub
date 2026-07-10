import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await login(form);
    if (!res.ok) {
      toast(res.error, "error");
      setErrors({ form: res.error });
    } else {
      toast("Welcome back!", "success");
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
          <h2>Welcome back 👋</h2>
          <p>Login to track orders, save favourites and check out faster.</p>
          <ul className="auth-perks"><li>✓ Faster checkout</li><li>✓ Order history</li><li>✓ Exclusive member offers</li></ul>
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1>Login</h1>
          {errors.form && <div className="auth-banner">{errors.form}</div>}
          <div className={`field ${errors.email ? "field-error" : ""}`}>
            <label>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className={`field ${errors.password ? "field-error" : ""}`}>
            <label>Password</label><input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg">Login</button>
          <button type="button" className="btn btn-outline btn-block auth-google-btn" onClick={handleGoogleSignIn}>
            <span className="google-icon">G</span>
            <span>Continue with Google</span>
          </button>
          <p className="auth-switch">New to FoodHub? <Link to="/signup">Create an account</Link></p>
        </form>
      </div>
    </div>
  );
}
