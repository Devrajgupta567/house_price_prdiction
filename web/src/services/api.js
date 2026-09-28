/**
 * API Service — Centralized HTTP client for ValuAltion backend.
 * Auto-attaches JWT token to all authenticated requests.
 */

/**
 * Builds the correct API base URL for all environments:
 *  - Local dev:    VITE_API_BASE_URL is unset → uses "/api/v1" (proxied by Vite)
 *  - Render prod:  VITE_API_BASE_URL = "valualtion-backend.onrender.com" (plain host)
 *                  → becomes "https://valualtion-backend.onrender.com/api/v1"
 */
function buildApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (!raw) return "/api/v1";                          // local dev via Vite proxy

  const trimmed = raw.replace(/\/$/, "");              // strip trailing slash

  // Already a full URL (has scheme)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
  }

  // Plain hostname injected by Render → add https:// and /api/v1
  return `https://${trimmed}/api/v1`;
}

const API_BASE = buildApiBase();

function getToken() {
  return localStorage.getItem("valualtion_token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error(
      typeof data === "object" ? data.message || data.error || "Request failed" : data || "Request failed"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ── Auth API ──────────────────────────────────────────
export const authAPI = {
  initiateSignup: (body) =>
    request("/auth/initiate-signup", { method: "POST", body: JSON.stringify(body) }),

  verifyOtp: (body) =>
    request("/auth/verify-otp", { method: "POST", body: JSON.stringify(body) }),

  completeProfile: (body) =>
    request("/auth/complete-profile", { method: "POST", body: JSON.stringify(body) }),

  resendOtp: (email) =>
    request("/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) }),

  signup: (body) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  signin: (body) =>
    request("/auth/signin", { method: "POST", body: JSON.stringify(body) }),

  me: () => request("/auth/me"),

  // Forgot password flow
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  verifyResetOtp: (email, otp) =>
    request("/auth/forgot-password/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) }),

  resetPassword: (email, otp, newPassword) =>
    request("/auth/forgot-password/reset", { method: "POST", body: JSON.stringify({ email, otp, newPassword }) }),
};


// ── Valuation API ─────────────────────────────────────
export const valuationAPI = {
  estimate: (body) =>
    request("/valuation/estimate", { method: "POST", body: JSON.stringify(body) }),

  getById: (id) => request(`/valuation/${id}`),

  history: () => request("/valuation/history"),

  emailReport: (id, body) =>
    request(`/valuation/${id}/email-report`, { method: "POST", body: JSON.stringify(body || {}) }),
};

// ── User API ──────────────────────────────────────────
export const userAPI = {
  getProfile: () => request("/users/profile"),
  updateProfile: (body) => request("/users/profile", { method: "PUT", body: JSON.stringify(body) }),
};

// ── Property API ──────────────────────────────────────
export const propertyAPI = {
  list: () => request("/properties"),

  create: (body) =>
    request("/properties", { method: "POST", body: JSON.stringify(body) }),

  getById: (id) => request(`/properties/${id}`),
};

// ── Admin API ──────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => request("/admin/users"),
  getUserDetails: (id) => request(`/admin/users/${id}`),
  getAllValuations: () => request("/admin/valuations"),
  getAnalytics: () => request("/admin/analytics"),
};

// ── Health API ────────────────────────────────────────
export const healthAPI = {
  check: () => request("/health"),
};
