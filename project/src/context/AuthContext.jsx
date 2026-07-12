import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = "https://foodhub-production-9792.up.railway.app/api/users";

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
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { ok: false, error: data.error || "Signup failed." };
      }

      // Backend now returns { user, token }
      const { user: safeUser, token } = data;
      if (token) localStorage.setItem("fh_token", token);
      setUser(safeUser || data);
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

      // Backend now returns { user, token }
      const { user: safeUser, token } = data;
      if (token) localStorage.setItem("fh_token", token);
      setUser(safeUser || data);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Unable to reach the server. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("fh_token");
  };

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
