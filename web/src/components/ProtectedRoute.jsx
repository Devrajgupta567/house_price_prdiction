import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps routes that require authentication.
 * Redirects to /signin if user is not logged in.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
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

  return children;
}
