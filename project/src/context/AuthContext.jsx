import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = "http://localhost:8000/api/users";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("fh_user");
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("fh_user", JSON.stringify(user));
    else localStorage.removeItem("fh_user");
  }, [user]);

  const signup = async ({ username, email, password }) => {
    try {
      const response = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { ok: false, error: data.error || "Signup failed." };
      }

      const { password: _pw, ...safe } = data;
      setUser(safe);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Unable to reach the server. Please try again." };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { ok: false, error: data.error || "Invalid email or password." };
      }

      const { password: _pw, ...safe } = data;
      setUser(safe);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Unable to reach the server. Please try again." };
    }
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
