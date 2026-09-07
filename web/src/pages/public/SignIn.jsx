import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function SignIn() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/estimate";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        {/* Left panel — branding */}
        <div className="auth-branding">
          <div className="auth-branding__inner">
            <Link to="/" className="auth-branding__logo">
              Valu<span className="navbar__logo-accent">Al</span>tion
            </Link>
            <h2 className="heading-2 auth-branding__title">
              Welcome Back
            </h2>
            <p className="body-lg text-secondary auth-branding__subtitle">
              Sign in to access your property valuations and analytics dashboard.
            </p>
            <div className="auth-branding__features">
              <div className="auth-feature-item">
                <span className="auth-feature-icon">📊</span>
                <span>AI-powered valuations</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">🏠</span>
                <span>Property portfolio tracking</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">📈</span>
                <span>Market trend analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="auth-form-panel">
          <div className="auth-form-card glass-card">
            <div className="auth-form-header">
              <h1 className="heading-3">Sign In</h1>
              <p className="body-sm text-secondary">
                Enter your credentials to continue
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" id="signin-form">
              <div className="form-group">
                <label className="form-label" htmlFor="signin-email">
                  Email Address
                </label>
                <div className="form-input-wrapper">
                  <Mail size={18} className="form-input-icon" />
                  <input
                    id="signin-email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className="form-label" htmlFor="signin-password">
                    Password
                  </label>
                  <Link to="/forgot-password" className="auth-link" style={{ fontSize: "0.8rem" }} id="signin-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="form-input-wrapper">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="form-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--accent btn--lg btn--full auth-submit-btn"
                disabled={loading}
                id="signin-submit"
              >
                {loading ? (
                  <span className="btn-loading-spinner" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-form-footer">
              <p className="body-sm text-secondary">
                Don't have an account?{" "}
                <Link to="/signup" className="auth-link">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
