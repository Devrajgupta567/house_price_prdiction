import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps routes that require ROLE_ADMIN.
 * Redirects non-admin users to their profile page.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="auth-loading-screen">
        <div className="auth-loading-spinner" />
        <p className="body-lg text-secondary">Loading...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user?.role !== "ROLE_ADMIN") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
