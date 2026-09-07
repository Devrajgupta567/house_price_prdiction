import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("valualtion_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authAPI.me()
        .then(ud => setUser(ud))
        .catch(() => {
          localStorage.removeItem("valualtion_token");
          setToken(null); setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  const saveSession = useCallback((res) => {
    localStorage.setItem("valualtion_token", res.token);
    setToken(res.token);
    setUser({ id: res.id, email: res.email, fullName: res.fullName, role: res.role });
  }, []);

  /** Step 1 — send OTP to email */
  const initiateSignup = useCallback(async (fullName, email) => {
    return authAPI.initiateSignup({ fullName, email });
  }, []);

  /** Step 2 — verify OTP (no JWT yet, just marks email verified) */
  const verifyOtp = useCallback(async (email, otp) => {
    return authAPI.verifyOtp({ email, otp });
  }, []);

  /** Step 3+4 — set password + profile → get JWT */
  const completeProfile = useCallback(async (payload) => {
    const res = await authAPI.completeProfile(payload);
    saveSession(res);
    return res;
  }, [saveSession]);

  /** Legacy register used by old tests */
  const register = useCallback(async (fullName, email, _password) => {
    return authAPI.initiateSignup({ fullName, email });
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.signin({ email, password });
    saveSession(res);
    return res;
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("valualtion_token");
    setToken(null); setUser(null);
  }, []);

  const isAdmin = user?.role === "ROLE_ADMIN";

  const value = {
    user, token, loading,
    isAuthenticated: !!user,
    isAdmin,
    initiateSignup, verifyOtp, completeProfile,
    register, login, logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
