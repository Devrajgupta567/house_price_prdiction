import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BarChart3, TrendingUp, Home, Shield, Search,
  ChevronRight, X, MapPin, Phone, Mail, Calendar,
  Briefcase, Award, DollarSign, Activity, Star,
  Building2, Eye, Download, Filter, Globe, User,
  CheckCircle, AlertCircle, Clock, ArrowUpRight
} from "lucide-react";
import { adminAPI } from "../../services/api";
import { generateValuationPDF } from "../../utils/pdfGenerator";

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n == null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtCompact = (n) =>
  n == null ? "—" : n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${(n / 1_000).toFixed(0)}K`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const initials = (name) =>
  (name || "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const avatarGradient = (str) => {
  const colors = [
    ["#7c3aed", "#a78bfa"],
    ["#0ea5e9", "#38bdf8"],
    ["#059669", "#34d399"],
    ["#d97706", "#fbbf24"],
    ["#db2777", "#f472b6"],
    ["#0891b2", "#22d3ee"],
    ["#7c2d12", "#fb923c"],
    ["#4f46e5", "#818cf8"],
  ];
  const idx = (str || "").charCodeAt(0) % colors.length;
  return colors[idx];
};

const confColor = (score) =>
  score >= 0.9 ? "#10b981" : score >= 0.75 ? "#f59e0b" : "#ef4444";

const confLabel = (level) =>
  level === "HIGH" ? "High" : level === "MODERATE" ? "Moderate" : "Low";

// ── Animation variants ───────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const modalBg = { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } };
const modalCard = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 28 } },
  exit: { opacity: 0, scale: 0.94, y: 20, transition: { duration: 0.2 } },
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, accent, delay = 0 }) {
  return (
    <motion.div
      className="admin-kpi-card"
      variants={fadeUp}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      style={{ "--accent": accent }}
    >
      <div className="admin-kpi-icon" style={{ background: `${accent}22`, color: accent }}>
        <Icon size={22} />
      </div>
      <div className="admin-kpi-body">
        <span className="admin-kpi-value">{value}</span>
        <span className="admin-kpi-label">{label}</span>
        {sub && <span className="admin-kpi-sub">{sub}</span>}
      </div>
      <div className="admin-kpi-glow" style={{ background: accent }} />
    </motion.div>
  );
}

// ── User Card ─────────────────────────────────────────────────────────────────
function UserCard({ user, onSelect }) {
  const [g0, g1] = avatarGradient(user.email);
  return (
    <motion.div
      className="admin-user-card glass-card"
      variants={fadeUp}
      whileHover={{ y: -5, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
      onClick={() => onSelect(user)}
      style={{ cursor: "pointer" }}
    >
      {/* Avatar */}
      <div className="admin-user-card__avatar"
        style={{ background: `linear-gradient(135deg, ${g0}, ${g1})` }}>
        {initials(user.fullName)}
        {user.verified && (
          <span className="admin-verified-badge" title="Verified">
            <CheckCircle size={12} />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="admin-user-card__info">
        <span className="admin-user-card__name">{user.fullName || "—"}</span>
        <span className="admin-user-card__email">{user.email}</span>
        <div className="admin-user-card__tags">
          {user.occupation && (
            <span className="admin-tag admin-tag--indigo">
              <Briefcase size={10} /> {user.occupation}
            </span>
          )}
          {user.city && (
            <span className="admin-tag admin-tag--teal">
              <MapPin size={10} /> {user.city}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="admin-user-card__stats">
        <div className="admin-stat-pill">
          <BarChart3 size={13} style={{ color: "var(--color-indigo-400)" }} />
          <span>{user.totalValuations} valuations</span>
        </div>
        {user.totalPortfolioValue > 0 && (
          <div className="admin-stat-pill">
            <DollarSign size={13} style={{ color: "#10b981" }} />
            <span>{fmtCompact(user.totalPortfolioValue)}</span>
          </div>
        )}
        {user.lastValuationAt && (
          <div className="admin-stat-pill">
            <Clock size={13} style={{ color: "var(--color-gold-400)" }} />
            <span>{fmtDate(user.lastValuationAt)}</span>
          </div>
        )}
      </div>

      <ChevronRight size={16} className="admin-user-card__chevron" />
    </motion.div>
  );
}

// ── Valuation Row ─────────────────────────────────────────────────────────────
function ValuationRow({ entry, index }) {
  const { valuation, owner } = entry;
  const [g0, g1] = avatarGradient(owner?.email || "?");

  const handlePdf = (e) => {
    e.stopPropagation();
    if (!valuation) return;
    const formData = {
      neighborhood: valuation.neighborhood,
      gr_liv_area: valuation.grLivArea,
      bedrooms: valuation.bedrooms,
      full_bath: valuation.fullBath,
      year_built: valuation.yearBuilt,
      overall_qual: valuation.overallQual,
      address: valuation.address,
    };
    generateValuationPDF(valuation, formData).catch(console.error);
  };

  return (
    <motion.div
      className="admin-val-row glass-card"
      variants={fadeUp}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Index */}
      <span className="admin-val-idx">{index + 1}</span>

      {/* Owner */}
      <div className="admin-val-owner">
        <div className="admin-val-avatar"
          style={{ background: `linear-gradient(135deg, ${g0}, ${g1})` }}>
          {initials(owner?.fullName)}
        </div>
        <div>
          <span className="admin-val-name">{owner?.fullName || "—"}</span>
          <span className="admin-val-email">{owner?.email || "—"}</span>
        </div>
      </div>

      {/* Address */}
      <div className="admin-val-address">
        <Building2 size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
        <span>{valuation.address || valuation.neighborhood || "—"}</span>
      </div>

      {/* Specs */}
      <div className="admin-val-specs">
        {valuation.grLivArea && <span>{Math.round(valuation.grLivArea).toLocaleString()} sqft</span>}
        {valuation.bedrooms && <span>{valuation.bedrooms} bd</span>}
        {valuation.fullBath && <span>{valuation.fullBath} ba</span>}
        {valuation.yearBuilt && <span>'{String(valuation.yearBuilt).slice(-2)}</span>}
        {valuation.overallQual && (
          <span className="admin-qual-badge" style={{ color: confColor(valuation.overallQual / 10) }}>
            Q{valuation.overallQual}
          </span>
        )}
      </div>

      {/* Price */}
      <span className="admin-val-price">{fmt(valuation.estimatedValue)}</span>

      {/* Confidence */}
      <div className="admin-val-conf" style={{ color: confColor(valuation.confidenceScore) }}>
        <Shield size={13} />
        <span>{valuation.confidenceScore ? Math.round(valuation.confidenceScore * 100) : "—"}%</span>
      </div>

      {/* Date */}
      <span className="admin-val-date">{fmtDate(valuation.createdAt)}</span>

      {/* Actions */}
      <button className="admin-val-btn" onClick={handlePdf} title="Download PDF">
        <Download size={14} />
      </button>
    </motion.div>
  );
}

// ── User Dossier Modal ────────────────────────────────────────────────────────
function UserDossierModal({ userId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminAPI.getUserDetails(userId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const user = data?.user;
  const valuations = data?.valuations || [];
  const [g0, g1] = avatarGradient(user?.email || "?");

  return (
    <motion.div className="admin-modal-backdrop" variants={modalBg} initial="hidden" animate="show" exit="exit"
      onClick={onClose}>
      <motion.div className="admin-modal glass-card" variants={modalCard} onClick={(e) => e.stopPropagation()}>
        <button className="admin-modal-close" onClick={onClose}><X size={18} /></button>

        {loading ? (
          <div className="admin-modal-loading">
            <motion.div className="admin-spinner"
              animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            <p>Loading dossier…</p>
          </div>
        ) : user ? (
          <>
            {/* Header */}
            <div className="admin-modal-header">
              <div className="admin-modal-avatar"
                style={{ background: `linear-gradient(135deg, ${g0}, ${g1})` }}>
                {initials(user.fullName)}
                {user.verified && (
                  <span className="admin-verified-badge admin-verified-badge--lg">
                    <CheckCircle size={14} />
                  </span>
                )}
              </div>
              <div>
                <h2 className="heading-3">{user.fullName || "—"}</h2>
                <p className="body-sm text-secondary">{user.role?.replace("ROLE_", "").replace("_", " ")}</p>
              </div>
              <div className="admin-modal-kpis">
                <div className="admin-modal-kpi-pill">
                  <BarChart3 size={14} />
                  <span>{user.totalValuations} valuations</span>
                </div>
                <div className="admin-modal-kpi-pill" style={{ color: "#10b981" }}>
                  <DollarSign size={14} />
                  <span>{fmtCompact(user.totalPortfolioValue)}</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="admin-modal-profile-grid">
              {[
                { icon: Mail, label: "Email", value: user.email },
                { icon: Phone, label: "Phone", value: user.phoneNumber },
                { icon: Calendar, label: "Age", value: user.age ? `${user.age} years` : null },
                { icon: User, label: "Gender", value: user.gender },
                { icon: Briefcase, label: "Occupation", value: user.occupation },
                { icon: MapPin, label: "Location", value: [user.city, user.stateProvince, user.zipCode].filter(Boolean).join(", ") || null },
                { icon: Globe, label: "Country", value: user.country },
                { icon: Calendar, label: "Joined", value: fmtDate(user.createdAt) },
              ].filter(f => f.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="admin-modal-field">
                  <Icon size={14} className="admin-modal-field-icon" />
                  <div>
                    <span className="admin-modal-field-label">{label}</span>
                    <span className="admin-modal-field-value">{value}</span>
                  </div>
                </div>
              ))}
            </div>

            {user.bio && (
              <div className="admin-modal-bio">
                <p className="body-sm text-secondary">{user.bio}</p>
              </div>
            )}

            {/* Valuation History */}
            <div className="admin-modal-hist-header">
              <Activity size={15} style={{ color: "var(--color-indigo-400)" }} />
              <h3 className="heading-5">Valuation History ({valuations.length})</h3>
            </div>

            <div className="admin-modal-hist-list">
              {valuations.length === 0 ? (
                <p className="body-sm text-tertiary" style={{ padding: "var(--space-4)" }}>No valuations yet.</p>
              ) : valuations.map((v, i) => (
                <div key={v.id || i} className="admin-modal-hist-item">
                  <div>
                    <span className="body-sm" style={{ fontWeight: 600 }}>{v.address || v.neighborhood || "Property"}</span>
                    <span className="body-xs text-tertiary"> · {fmtDate(v.createdAt)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                    <span className="admin-modal-price">{fmt(v.estimatedValue)}</span>
                    <span className="admin-tag" style={{ color: confColor(v.confidenceScore), background: `${confColor(v.confidenceScore)}22` }}>
                      <Shield size={10} /> {v.confidenceLevel || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-secondary">User not found.</p>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Neighborhood Chart ────────────────────────────────────────────────────────
function NeighborhoodChart({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return <p className="body-sm text-tertiary" style={{ padding: "var(--space-6)" }}>No neighborhood data yet.</p>;
  }
  const entries = Object.entries(data);
  const maxVal = Math.max(...entries.map(([, v]) => v));

  return (
    <div className="admin-nb-chart">
      {entries.map(([nb, count], i) => (
        <div key={nb} className="admin-nb-row">
          <span className="admin-nb-label">{nb}</span>
          <div className="admin-nb-bar-track">
            <motion.div
              className="admin-nb-bar"
              initial={{ width: 0 }}
              animate={{ width: `${(count / maxVal) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
            />
          </div>
          <span className="admin-nb-count">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [valuations, setValuations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, v, a] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getAllValuations(),
        adminAPI.getAnalytics(),
      ]);
      setUsers(u || []);
      setValuations(v || []);
      setAnalytics(a || null);
    } catch (e) {
      setError(e.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.city?.toLowerCase().includes(q) ||
      u.occupation?.toLowerCase().includes(q)
    );
  });

  const filteredValuations = valuations.filter((entry) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const { valuation, owner } = entry;
    return (
      owner?.fullName?.toLowerCase().includes(q) ||
      owner?.email?.toLowerCase().includes(q) ||
      valuation?.address?.toLowerCase().includes(q) ||
      valuation?.neighborhood?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-loading">
          <motion.div className="admin-spinner-lg"
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} />
          <p className="body-lg text-secondary">Loading platform intelligence…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-page">
        <div className="admin-error glass-card">
          <AlertCircle size={32} style={{ color: "#ef4444" }} />
          <h2 className="heading-4">Failed to load data</h2>
          <p className="body-base text-secondary">{error}</p>
          <button className="btn btn--primary" onClick={loadData}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="admin-page">
        {/* ── Page Header ── */}
        <motion.div className="admin-header" initial="hidden" animate="show" variants={stagger}>
          <motion.div variants={fadeUp}>
            <div className="admin-header__eyebrow">
              <Activity size={14} />
              <span>Platform Intelligence</span>
            </div>
            <h1 className="heading-1 admin-page-title">
              Admin <span className="text-gradient-gold">Dashboard</span>
            </h1>
            <p className="body-lg text-secondary">
              Real-time visibility across all registered users, valuations, and market activity.
            </p>
          </motion.div>
        </motion.div>

        {/* ── KPI Cards ── */}
        {analytics && (
          <motion.div className="admin-kpi-grid" initial="hidden" animate="show" variants={stagger}>
            <KpiCard icon={Users} label="Total Users" value={analytics.totalUsers.toLocaleString()}
              sub={`${analytics.verifiedUsers} verified`} accent="#7c3aed" delay={0} />
            <KpiCard icon={BarChart3} label="Total Valuations" value={analytics.totalValuations.toLocaleString()}
              sub="Across all accounts" accent="#0ea5e9" delay={0.05} />
            <KpiCard icon={DollarSign} label="Portfolio Volume"
              value={analytics.totalPortfolioVolume >= 1_000_000
                ? `$${(analytics.totalPortfolioVolume / 1_000_000).toFixed(1)}M`
                : `$${(analytics.totalPortfolioVolume / 1_000).toFixed(0)}K`}
              sub="Combined AI estimates" accent="#10b981" delay={0.1} />
            <KpiCard icon={TrendingUp} label="Avg. Valuation"
              value={fmtCompact(analytics.averageValuationPrice)}
              sub="Per property estimate" accent="#f59e0b" delay={0.15} />
          </motion.div>
        )}

        {/* ── Tabs + Search ── */}
        <div className="admin-toolbar">
          <div className="admin-tabs">
            {[
              { id: "users", label: "Users", icon: Users, count: users.length },
              { id: "valuations", label: "Valuations", icon: BarChart3, count: valuations.length },
              { id: "market", label: "Market", icon: TrendingUp },
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                className={`admin-tab ${tab === id ? "admin-tab--active" : ""}`}
                onClick={() => { setTab(id); setSearch(""); }}
              >
                <Icon size={15} />
                {label}
                {count != null && <span className="admin-tab-count">{count}</span>}
              </button>
            ))}
          </div>

          {tab !== "market" && (
            <div className="admin-search">
              <Search size={15} className="admin-search-icon" />
              <input
                type="text"
                placeholder={tab === "users" ? "Search users…" : "Search valuations…"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
              {search && (
                <button className="admin-search-clear" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* USERS TAB */}
          {tab === "users" && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {filteredUsers.length === 0 ? (
                <div className="admin-empty">
                  <Users size={40} style={{ opacity: 0.3 }} />
                  <p className="body-base text-tertiary">No users match your search.</p>
                </div>
              ) : (
                <motion.div className="admin-user-grid" variants={stagger} initial="hidden" animate="show">
                  {filteredUsers.map((u) => (
                    <UserCard key={u.id} user={u} onSelect={(u) => setSelectedUserId(u.id)} />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* VALUATIONS TAB */}
          {tab === "valuations" && (
            <motion.div key="valuations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>

              {/* Table Header */}
              <div className="admin-val-header">
                <span>#</span>
                <span>Owner</span>
                <span>Property</span>
                <span>Specs</span>
                <span>Estimate</span>
                <span>Confidence</span>
                <span>Date</span>
                <span></span>
              </div>

              {filteredValuations.length === 0 ? (
                <div className="admin-empty">
                  <BarChart3 size={40} style={{ opacity: 0.3 }} />
                  <p className="body-base text-tertiary">No valuations match your search.</p>
                </div>
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="show">
                  {filteredValuations.map((entry, i) => (
                    <ValuationRow key={entry.valuation?.id || i} entry={entry} index={i} />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* MARKET TAB */}
          {tab === "market" && (
            <motion.div key="market" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              className="admin-market-grid">

              <motion.div className="glass-card admin-market-card" variants={fadeUp}>
                <div className="admin-market-card__header">
                  <MapPin size={18} style={{ color: "var(--color-indigo-400)" }} />
                  <h3 className="heading-5">Valuations by Neighborhood</h3>
                </div>
                <NeighborhoodChart data={analytics?.valuationsByNeighborhood} />
              </motion.div>

              <motion.div className="glass-card admin-market-card" variants={fadeUp}>
                <div className="admin-market-card__header">
                  <Activity size={18} style={{ color: "#10b981" }} />
                  <h3 className="heading-5">Platform Metrics</h3>
                </div>
                <div className="admin-metrics-list">
                  {[
                    { label: "Avg. Price / Sq. Ft.", value: `$${analytics?.averagePricePerSqft?.toFixed(0) || "—"}/sqft`, icon: TrendingUp, color: "#10b981" },
                    { label: "Verified Users", value: `${analytics?.verifiedUsers || 0} / ${analytics?.totalUsers || 0}`, icon: CheckCircle, color: "#7c3aed" },
                    { label: "Valuations Executed", value: (analytics?.totalValuations || 0).toLocaleString(), icon: BarChart3, color: "#0ea5e9" },
                    { label: "Total Portfolio Volume", value: fmtCompact(analytics?.totalPortfolioVolume), icon: DollarSign, color: "#f59e0b" },
                    { label: "Avg. Valuation Price", value: fmtCompact(analytics?.averageValuationPrice), icon: Home, color: "#db2777" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="admin-metric-row">
                      <div className="admin-metric-icon" style={{ color, background: `${color}22` }}>
                        <Icon size={16} />
                      </div>
                      <span className="admin-metric-label">{label}</span>
                      <span className="admin-metric-value" style={{ color }}>{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── User Dossier Modal ── */}
      <AnimatePresence>
        {selectedUserId && (
          <UserDossierModal
            userId={selectedUserId}
            onClose={() => setSelectedUserId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
