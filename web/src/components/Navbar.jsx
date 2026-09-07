import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, LogOut, User, LayoutDashboard, Calculator, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/estimate", label: "Valuation Tool" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/features", label: "Features" },
  { to: "/sample-report", label: "Sample Report" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navClass = `navbar ${scrolled ? "navbar--solid" : "navbar--glass"}`;
  const displayName = user?.fullName?.split(" ")[0] || "User";

  return (
    <>
      <nav className={navClass} ref={navRef} role="navigation" aria-label="Main navigation">
        <div className="navbar__inner">
          {/* Brand Logo with Icon */}
          <Logo />

          {/* Desktop Nav Links */}
          <div className="navbar__nav">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`navbar__link ${active ? "navbar__link--active" : ""}`}
                >
                  {label}
                  {active && <span className="nav-active-indicator" />}
                </Link>
              );
            })}

            {isAuthenticated && (
              <Link
                to="/profile"
                className={`navbar__link ${location.pathname === "/profile" || location.pathname === "/dashboard" ? "navbar__link--active" : ""}`}
              >
                Dashboard &amp; Profile
                {(location.pathname === "/profile" || location.pathname === "/dashboard") && (
                  <span className="nav-active-indicator" />
                )}
              </Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`navbar__link ${location.pathname === "/admin" ? "navbar__link--active" : ""}`}
              >
                <ShieldCheck size={14} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                Admin
                {location.pathname === "/admin" && <span className="nav-active-indicator" />}
              </Link>
            )}
          </div>

          {/* Action Buttons & Theme Toggle */}
          <div className="navbar__actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon-toggle theme-toggle-btn"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            >
              {isDark ? (
                <Sun size={18} className="theme-icon sun-icon" />
              ) : (
                <Moon size={18} className="theme-icon moon-icon" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* User profile link button */}
                <Link
                  to="/profile"
                  className="navbar-user-badge desktop-only"
                  style={{ textDecoration: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  title="View Profile & Dashboard"
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "var(--badge-gold-bg, rgba(197,165,90,0.2))",
                      border: "1px solid rgba(197,165,90,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <User size={12} style={{ color: "var(--text-accent, #c5a55a)" }} />
                  </div>
                  <span className="body-sm">{displayName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn--ghost btn--sm desktop-only"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>

                <Link
                  to="/estimate"
                  className="btn btn--accent btn--sm get-estimate-btn"
                >
                  <Calculator size={15} />
                  <span>Estimate</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="btn btn--ghost btn--sm desktop-only"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn btn--secondary btn--sm desktop-only"
                >
                  Sign Up
                </Link>
                <Link
                  to="/estimate"
                  className="btn btn--accent btn--sm get-estimate-btn"
                >
                  <span>Estimate</span>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu modal overlay */}
      <div className={`navbar__mobile-menu ${mobileOpen ? "navbar__mobile-menu--open" : ""}`}>
        <div className="mobile-menu-inner">
          <div className="mobile-links-list">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`navbar__mobile-link ${location.pathname === to ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className={`navbar__mobile-link ${location.pathname === "/profile" ? "active" : ""}`}
              >
                <LayoutDashboard size={16} />
                Dashboard &amp; Profile
              </Link>
            )}
          </div>

          <div className="mobile-menu-footer">
            <div className="flex--between" style={{ marginBottom: "var(--space-4)" }}>
              <span className="body-sm text-secondary">Interface Theme</span>
              <button onClick={toggleTheme} className="theme-pill-btn">
                {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="navbar-user-badge"
                  style={{ marginBottom: "var(--space-3)", justifyContent: "center", textDecoration: "none" }}
                >
                  <User size={14} />
                  <span className="body-sm">{user?.fullName || "My Profile"}</span>
                </Link>
                <Link
                  to="/estimate"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn--primary btn--full"
                >
                  Get Property Estimate
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="btn btn--secondary btn--full"
                  style={{ marginTop: "var(--space-2)" }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn--secondary btn--full"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn--primary btn--full"
                  style={{ marginTop: "var(--space-2)" }}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
