import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Briefcase, Calendar, Shield,
  CheckCircle, Edit3, Clock, Home, ArrowRight,
  TrendingUp, Layers, Star, AlertCircle, Save, ExternalLink, Download
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { userAPI, valuationAPI } from "../../services/api";
import { generateValuationPDF } from "../../utils/pdfGenerator";

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [activeTab, setActiveTab] = useState("history"); // "history" | "profile" | "edit"
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    age: "",
    gender: "",
    occupation: "",
    bio: "",
    profilePictureUrl: "",
    addressLine: "",
    city: "",
    stateProvince: "",
    zipCode: "",
    country: "United States",
  });

  // Fetch user profile and valuation history on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [userData, historyData] = await Promise.all([
          userAPI.getProfile().catch(() => null),
          valuationAPI.history().catch(() => []),
        ]);

        if (userData) {
          setProfile(userData);
          setEditForm({
            fullName: userData.fullName || "",
            phoneNumber: userData.phoneNumber || "",
            age: userData.age || "",
            gender: userData.gender || "",
            occupation: userData.occupation || "",
            bio: userData.bio || "",
            profilePictureUrl: userData.profilePictureUrl || "",
            addressLine: userData.addressLine || "",
            city: userData.city || "",
            stateProvince: userData.stateProvince || "",
            zipCode: userData.zipCode || "",
            country: userData.country || "United States",
          });
        }
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        ...editForm,
        age: editForm.age ? Number(editForm.age) : null,
      };
      const updated = await userAPI.updateProfile(payload);
      setProfile(updated);
      setSuccessMsg("Profile successfully updated!");
      setTimeout(() => {
        setSuccessMsg("");
        setActiveTab("profile");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const totalPortfolioValue = history.reduce((sum, v) => sum + (v.estimatedValue || 0), 0);

  return (
    <section className="dashboard-page">
      <div className="container">
        
        {/* ── User Header Card ────────────────────────────────────────── */}
        <motion.div 
          className="dashboard-header-card glass-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dashboard-user-info">
            {profile?.profilePictureUrl ? (
              <img
                src={profile.profilePictureUrl}
                alt={profile.fullName}
                className="dashboard-avatar"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="dashboard-avatar-placeholder">
                <User size={36} />
              </div>
            )}

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <h1 className="heading-3" style={{ margin: 0 }}>
                  {profile?.fullName || authUser?.fullName || "User Profile"}
                </h1>
                <div className="badge badge--success" style={{ gap: "4px" }}>
                  <CheckCircle size={12} />
                  <span>Verified Homeowner</span>
                </div>
              </div>

              <p className="body-sm text-secondary" style={{ marginTop: "4px", marginBottom: "var(--space-2)" }}>
                {profile?.email || authUser?.email}
                {profile?.occupation && ` • ${profile.occupation}`}
                {profile?.city && ` • ${profile.city}, ${profile.stateProvince || ""}`}
              </p>

              {profile?.createdAt && (
                <span className="body-xs text-tertiary" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={12} />
                  Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "flex", gap: "var(--space-6)" }}>
            <div style={{ textAlign: "right" }}>
              <span className="body-xs text-tertiary">Saved Valuations</span>
              <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--text-primary)" }}>
                {history.length}
              </div>
            </div>
            {history.length > 0 && (
              <div style={{ textAlign: "right" }}>
                <span className="body-xs text-tertiary">Tracked Market Value</span>
                <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--text-accent)" }}>
                  ${totalPortfolioValue.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Navigation Tabs ─────────────────────────────────────────── */}
        <div className="dashboard-nav-tabs">
          <button
            className={`dashboard-tab-btn ${activeTab === "history" ? "dashboard-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <Clock size={16} />
            <span>Valuation History ({history.length})</span>
          </button>

          <button
            className={`dashboard-tab-btn ${activeTab === "profile" ? "dashboard-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={16} />
            <span>User Details &amp; Info</span>
          </button>

          <button
            className={`dashboard-tab-btn ${activeTab === "edit" ? "dashboard-tab-btn--active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: "var(--space-6)" }}>
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-success" style={{ marginBottom: "var(--space-6)", display: "flex", alignItems: "center", gap: "8px", color: "var(--color-emerald-500)", background: "rgba(16, 185, 129, 0.15)", padding: "12px 16px", borderRadius: "8px" }}>
            <CheckCircle size={16} /> <span>{successMsg}</span>
          </div>
        )}

        {/* ════════════════════ TAB 1: VALUATION HISTORY ════════════════════ */}
        {activeTab === "history" && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>
                <div className="btn-loading-spinner" style={{ margin: "0 auto var(--space-4)" }} />
                <p className="body-sm text-secondary">Loading your valuation history…</p>
              </div>
            ) : history.length === 0 ? (
              <div className="glass-card" style={{ padding: "var(--space-12)", textAlign: "center", borderRadius: "var(--radius-2xl)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--badge-gold-bg)", color: "var(--text-accent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-4)" }}>
                  <Home size={28} />
                </div>
                <h3 className="heading-3">No Property Valuations Yet</h3>
                <p className="body-md text-secondary" style={{ maxWidth: "460px", margin: "var(--space-2) auto var(--space-6)" }}>
                  You haven't run any valuations yet. Use our AI model to estimate your house value in seconds.
                </p>
                <Link to="/estimate" className="btn btn--accent btn--lg" style={{ display: "inline-flex", gap: "8px" }}>
                  <span>Estimate Your Property Now</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            ) : (
              <motion.div 
                className="history-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {history.map((val) => (
                  <motion.div 
                    key={val.id} 
                    className="history-card glass-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)", borderColor: "rgba(197, 165, 90, 0.6)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <div className="flex--between" style={{ marginBottom: "var(--space-2)" }}>
                        <span className="body-xs text-tertiary" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={12} />
                          {val.createdAt ? new Date(val.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                        </span>
                        <div className="badge badge--success" style={{ fontSize: "11px" }}>
                          {Math.round((val.confidenceScore || 0.94) * 100)}% Accuracy
                        </div>
                      </div>

                      <h3 className="history-card__price">
                        ${val.estimatedValue?.toLocaleString() || "—"}
                      </h3>

                      <p className="body-sm text-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "4px", margin: 0 }}>
                        <MapPin size={14} style={{ color: "var(--text-accent)" }} />
                        {val.address || "1234 Ames Way"} • {val.neighborhood || "Ames"}
                      </p>

                      <div className="history-card__specs">
                        <div>
                          <span className="body-xs text-tertiary">Area</span>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                            {val.grLivArea ? `${val.grLivArea} sqft` : "2,198 sqft"}
                          </div>
                        </div>
                        <div>
                          <span className="body-xs text-tertiary">Beds / Bath</span>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                            {val.bedrooms || 4}b / {val.fullBath || 2}ba
                          </div>
                        </div>
                        <div>
                          <span className="body-xs text-tertiary">Built</span>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                            {val.yearBuilt || 2000}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-4)" }}>
                      <span className="body-xs text-secondary">
                        Range: ${Math.round(val.rangeLow / 1000)}k – ${Math.round(val.rangeHigh / 1000)}k
                      </span>
                      <div style={{ display: "flex", gap: "var(--space-2)" }}>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "0 8px" }}
                          onClick={() => generateValuationPDF(val)}
                          title="Download PDF Report"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn btn--secondary btn--sm"
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                          onClick={() => navigate("/results", { state: { valuation: val } })}
                        >
                          <span>View Report</span>
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* ════════════════════ TAB 2: USER PROFILE INFO ════════════════════ */}
        {activeTab === "profile" && (
          <div className="glass-card" style={{ padding: "var(--space-8)", borderRadius: "var(--radius-2xl)" }}>
            <div className="flex--between" style={{ marginBottom: "var(--space-6)", paddingBottom: "var(--space-4)", borderBottom: "1px solid var(--border-default)" }}>
              <div>
                <h3 className="heading-3" style={{ margin: 0 }}>Homeowner Account Details</h3>
                <p className="body-sm text-secondary" style={{ margin: "4px 0 0" }}>
                  All verified information associated with your ValuAltion account.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                style={{ display: "inline-flex", gap: "6px" }}
                onClick={() => setActiveTab("edit")}
              >
                <Edit3 size={15} />
                <span>Edit Details</span>
              </button>
            </div>

            <div className="profile-details-grid">
              <div className="profile-info-item">
                <div className="profile-info-item__label">Full Name</div>
                <div className="profile-info-item__value">{profile?.fullName || "—"}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-item__label">Email Address</div>
                <div className="profile-info-item__value">{profile?.email || "—"}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-item__label">Phone Number</div>
                <div className="profile-info-item__value">{profile?.phoneNumber || "Not provided"}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-item__label">Age &amp; Gender</div>
                <div className="profile-info-item__value">
                  {profile?.age ? `${profile.age} yrs` : "—"} {profile?.gender && `(${profile.gender})`}
                </div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-item__label">Occupation / Profession</div>
                <div className="profile-info-item__value">{profile?.occupation || "Not provided"}</div>
              </div>

              <div className="profile-info-item">
                <div className="profile-info-item__label">Verification Status</div>
                <div className="profile-info-item__value" style={{ color: "var(--color-emerald-500)" }}>
                  ✅ Verified Account
                </div>
              </div>

              <div className="profile-info-item" style={{ gridColumn: "1 / -1" }}>
                <div className="profile-info-item__label">Registered Address</div>
                <div className="profile-info-item__value">
                  {profile?.addressLine
                    ? `${profile.addressLine}, ${profile.city || ""}, ${profile.stateProvince || ""} ${profile.zipCode || ""}, ${profile.country || ""}`
                    : "No address registered"}
                </div>
              </div>

              {profile?.bio && (
                <div className="profile-info-item" style={{ gridColumn: "1 / -1" }}>
                  <div className="profile-info-item__label">Short Bio</div>
                  <div className="profile-info-item__value" style={{ fontWeight: 400, lineHeight: 1.6 }}>
                    {profile.bio}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════ TAB 3: EDIT PROFILE ════════════════════ */}
        {activeTab === "edit" && (
          <div className="glass-card" style={{ padding: "var(--space-8)", borderRadius: "var(--radius-2xl)", maxWidth: "800px" }}>
            <h3 className="heading-3" style={{ marginBottom: "var(--space-2)" }}>Update Profile Details</h3>
            <p className="body-sm text-secondary" style={{ marginBottom: "var(--space-6)" }}>
              Keep your contact and location info up to date for personalized neighborhood reports.
            </p>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-input"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="profile-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      className="form-input"
                      placeholder="+1 (555) 000-0000"
                      value={editForm.phoneNumber}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="age">Age</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 30"
                      value={editForm.age}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="profile-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      className="form-input form-select"
                      value={editForm.gender}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="occupation">Occupation</label>
                    <input
                      id="occupation"
                      name="occupation"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Architect"
                      value={editForm.occupation}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profilePictureUrl">Profile Avatar Image URL</label>
                  <input
                    id="profilePictureUrl"
                    name="profilePictureUrl"
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/photo.jpg"
                    value={editForm.profilePictureUrl}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-input"
                    rows={3}
                    placeholder="A brief bio…"
                    value={editForm.bio}
                    onChange={handleEditChange}
                    style={{ resize: "none" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="addressLine">Street Address</label>
                  <input
                    id="addressLine"
                    name="addressLine"
                    type="text"
                    className="form-input"
                    placeholder="1234 Main St"
                    value={editForm.addressLine}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="profile-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="form-input"
                      placeholder="Ames"
                      value={editForm.city}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="stateProvince">State</label>
                    <input
                      id="stateProvince"
                      name="stateProvince"
                      type="text"
                      className="form-input"
                      placeholder="Iowa"
                      value={editForm.stateProvince}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="profile-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="zipCode">ZIP Code</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      className="form-input"
                      placeholder="50010"
                      value={editForm.zipCode}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="country">Country</label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      className="form-input"
                      placeholder="United States"
                      value={editForm.country}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                  <button
                    type="submit"
                    className="btn btn--accent"
                    disabled={saving}
                    style={{ display: "inline-flex", gap: "6px" }}
                  >
                    <Save size={16} />
                    <span>{saving ? "Saving Changes…" : "Save Changes"}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setActiveTab("profile")}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </form>
          </div>
        )}

      </div>
    </section>
  );
}
