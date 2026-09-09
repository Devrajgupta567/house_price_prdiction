import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  DollarSign, TrendingUp, TrendingDown, Home, BedDouble, Bath,
  Calendar, Star, MapPin, ArrowLeft, RotateCcw, Shield, BarChart3,
  Download, Mail, CheckCircle2, AlertCircle, SlidersHorizontal,
  ChevronRight, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateValuationPDF } from "../../utils/pdfGenerator";
import { valuationAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const valuation = location.state?.valuation;
  const formData = location.state?.formData;

  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [emailStatus, setEmailStatus] = useState("idle"); // 'idle' | 'sending' | 'success' | 'error'
  const [emailFeedback, setEmailFeedback] = useState("");

  if (!valuation) {
    return (
      <section className="wizard-page">
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <div className="glass-card" style={{ padding: "var(--space-12)" }}>
            <h2 className="heading-3" style={{ marginBottom: "var(--space-4)" }}>
              No Valuation Data
            </h2>
            <p className="body-lg text-secondary" style={{ marginBottom: "var(--space-8)" }}>
              Please complete the property valuation form first.
            </p>
            <Link to="/estimate" className="btn btn--accent btn--lg">
              Start Valuation
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const estimated = valuation.estimatedValue || 0;
  const low = valuation.rangeLow || estimated * 0.95;
  const high = valuation.rangeHigh || estimated * 1.05;
  const confidence = valuation.confidenceScore || 0.85;
  const confidenceLevel = valuation.confidenceLevel || "HIGH";
  const confidencePct = Math.round(confidence * 100);

  const baselinePrice = valuation.baselinePrice || 130000;
  const priceDifference = valuation.priceDifference || (estimated - baselinePrice);
  const diffPct = baselinePrice > 0 ? Math.round((priceDifference / baselinePrice) * 100) : 0;

  const attributions = valuation.attributions || [];

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const confidenceColor =
    confidence >= 0.85 ? "var(--color-emerald-500)" :
    confidence >= 0.70 ? "var(--color-gold-500)" :
    "var(--color-rose-500)";

  const confidenceLabel =
    confidence >= 0.85 ? "High Accuracy" :
    confidence >= 0.70 ? "Moderate Accuracy" :
    "Low Accuracy";

  // Categories list for filtering
  const categories = ["ALL", ...new Set(attributions.map(a => a.category).filter(Boolean))];
  const filteredAttributions = selectedCategory === "ALL"
    ? attributions
    : attributions.filter(a => a.category === selectedCategory);

  const maxAbsoluteAmount = Math.max(
    ...attributions.map(a => Math.abs(a.amount || 0)),
    1000
  );

  const handleEmailReport = async () => {
    try {
      setEmailStatus("sending");
      setEmailFeedback("");

      // Generate PDF Base64 string from client
      let pdfBase64 = null;
      try {
        pdfBase64 = await generateValuationPDF(valuation, formData, {
          autoDownload: false,
          returnBase64: true
        });
      } catch (err) {
        console.warn("Client PDF generation for email had issue, proceeding with backend generator:", err);
      }

      await valuationAPI.emailReport(valuation.id, {
        email: user?.email,
        pdfBase64: pdfBase64 || null
      });

      setEmailStatus("success");
      setEmailFeedback(`Valuation report PDF delivered to ${user?.email || "your inbox"}!`);
      setTimeout(() => setEmailStatus("idle"), 6000);
    } catch (err) {
      console.error("Email send failed:", err);
      setEmailStatus("error");
      setEmailFeedback(err.message || "Unable to send email. Please verify your SMTP settings.");
      setTimeout(() => setEmailStatus("idle"), 6000);
    }
  };

  return (
    <section className="results-page" style={{ paddingBottom: "var(--space-20)" }}>
      <div className="container">
        {/* Header */}
        <motion.div 
          className="results-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => navigate("/estimate")}
          >
            <ArrowLeft size={16} />
            Back to Form
          </button>
          <h1 className="heading-2">Valuation Results & Attribution</h1>
          <p className="body-lg text-secondary">
            AI-powered property value estimation with Explainable AI (XAI) feature attribution
          </p>
        </motion.div>

        {/* Email Toast Notification */}
        <AnimatePresence>
          {emailStatus !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              style={{
                marginBottom: "var(--space-6)",
                padding: "var(--space-4) var(--space-6)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                background: emailStatus === "success" ? "rgba(16, 185, 129, 0.15)" : emailStatus === "error" ? "rgba(244, 63, 94, 0.15)" : "rgba(212, 175, 55, 0.15)",
                border: emailStatus === "success" ? "1px solid var(--color-emerald-500)" : emailStatus === "error" ? "1px solid var(--color-rose-500)" : "1px solid var(--color-gold-500)",
                color: emailStatus === "success" ? "var(--color-emerald-400)" : emailStatus === "error" ? "var(--color-rose-400)" : "var(--color-gold-300)"
              }}
            >
              {emailStatus === "sending" && <div className="spinner-border" style={{ width: 18, height: 18 }} />}
              {emailStatus === "success" && <CheckCircle2 size={20} />}
              {emailStatus === "error" && <AlertCircle size={20} />}
              <span className="body-sm" style={{ fontWeight: 600 }}>
                {emailStatus === "sending" ? "Generating and dispatching official valuation dossier..." : emailFeedback}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main price card */}
        <motion.div 
          className="results-price-card glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        >
          <div className="results-price-badge">
            <DollarSign size={20} />
            <span>Estimated Market Value</span>
          </div>
          <div className="results-price-value heading-display">
            {formatCurrency(estimated)}
          </div>
          <div className="results-price-range">
            <div className="results-range-item">
              <TrendingDown size={16} style={{ color: "var(--color-rose-500)" }} />
              <span className="body-sm text-secondary">Conservative</span>
              <span className="body-base" style={{ fontWeight: 600 }}>
                {formatCurrency(low)}
              </span>
            </div>
            <div className="results-range-divider" />
            <div style={{ textAlign: "center" }}>
              <span className="body-xs text-tertiary">Estimated Range</span>
            </div>
            <div className="results-range-divider" />
            <div className="results-range-item">
              <TrendingUp size={16} style={{ color: "var(--color-emerald-500)" }} />
              <span className="body-sm text-secondary">Optimistic</span>
              <span className="body-base" style={{ fontWeight: 600 }}>
                {formatCurrency(high)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div 
          className="results-stats-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
        >
          {/* Confidence */}
          <motion.div 
            className="results-stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="results-stat-icon" style={{ color: confidenceColor }}>
              <Shield size={22} />
            </div>
            <div>
              <span className="body-xs text-tertiary">Model Accuracy</span>
              <span className="heading-4" style={{ color: confidenceColor }}>
                {confidencePct}%
              </span>
              <span className="body-xs" style={{ color: confidenceColor }}>
                {confidenceLabel}
              </span>
            </div>
          </motion.div>

          {/* Price per sqft */}
          <motion.div 
            className="results-stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="results-stat-icon" style={{ color: "var(--color-indigo-500)" }}>
              <BarChart3 size={22} />
            </div>
            <div>
              <span className="body-xs text-tertiary">Price / sq ft</span>
              <span className="heading-4">
                {formData?.gr_liv_area
                  ? formatCurrency(estimated / formData.gr_liv_area)
                  : (valuation.grLivArea ? formatCurrency(estimated / valuation.grLivArea) : "—")}
              </span>
              <span className="body-xs text-tertiary">per sq ft</span>
            </div>
          </motion.div>

          {/* Value vs Benchmark */}
          <motion.div 
            className="results-stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="results-stat-icon" style={{ color: "var(--color-emerald-400)" }}>
              <BarChart3 size={22} />
            </div>
            <div>
              <span className="body-xs text-tertiary">Vs Ames Benchmark</span>
              <span className="heading-4" style={{ color: "var(--color-emerald-400)" }}>
                {priceDifference >= 0 ? `+${diffPct}%` : `${diffPct}%`}
              </span>
              <span className="body-xs text-tertiary">
                {priceDifference >= 0 ? `+${formatCurrency(priceDifference)}` : formatCurrency(priceDifference)}
              </span>
            </div>
          </motion.div>

          {/* Neighborhood */}
          <motion.div 
            className="results-stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="results-stat-icon" style={{ color: "var(--color-gold-500)" }}>
              <MapPin size={22} />
            </div>
            <div>
              <span className="body-xs text-tertiary">Location</span>
              <span className="heading-4" style={{ fontSize: "1.1rem" }}>
                {valuation.neighborhood || formData?.neighborhood || "Ames, IA"}
              </span>
              <span className="body-xs text-tertiary">Regional Market</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── EXPLAINABLE AI (XAI) ATTRIBUTION SECTION ─────────────────────── */}
        {attributions.length > 0 && (
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              padding: "var(--space-8)",
              marginBottom: "var(--space-8)",
              border: "1px solid rgba(212, 175, 55, 0.25)"
            }}
          >
            {/* Header & Explanation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)", padding: "4px 12px", borderRadius: "999px", background: "rgba(212, 175, 55, 0.12)", color: "var(--color-gold-400)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "var(--space-2)" }}>
                  <SlidersHorizontal size={14} />
                  Explainable AI (XAI) Valuation Attribution
                </div>
                <h3 className="heading-3" style={{ margin: "4px 0" }}>
                  Why is this home valued at {formatCurrency(estimated)}?
                </h3>
                <p className="body-base text-secondary" style={{ maxWidth: "700px", margin: 0 }}>
                  Our machine learning model decomposes the total valuation into individual value drivers relative to a regional benchmark property ({formatCurrency(baselinePrice)} baseline).
                </p>
              </div>

              {/* Benchmark Summary Badge */}
              <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "var(--space-4) var(--space-6)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-subtle)", textAlign: "right" }}>
                <div className="body-xs text-tertiary">Net Value Added</div>
                <div className="heading-4" style={{ color: priceDifference >= 0 ? "var(--color-emerald-400)" : "var(--color-rose-400)", margin: "2px 0" }}>
                  {priceDifference >= 0 ? `+${formatCurrency(priceDifference)}` : formatCurrency(priceDifference)}
                </div>
                <div className="body-xs text-secondary">
                  Over baseline ({formatCurrency(baselinePrice)})
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-6)", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "var(--space-4)" }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: selectedCategory === cat ? "var(--color-gold-500)" : "rgba(255, 255, 255, 0.05)",
                      color: selectedCategory === cat ? "#0f172a" : "var(--color-text-secondary)"
                    }}
                  >
                    {cat === "ALL" ? "All Drivers" : cat}
                  </button>
                ))}
              </div>
            )}

            {/* Feature Attribution Drivers List & Bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {filteredAttributions.map((attr, idx) => {
                const isPositive = attr.impact === "POSITIVE" || attr.amount >= 0;
                const barWidth = Math.min(Math.max((Math.abs(attr.amount) / maxAbsoluteAmount) * 100, 4), 100);

                return (
                  <motion.div
                    key={attr.feature_name || attr.featureName || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-4) var(--space-5)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-2)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                          <span className="body-base" style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>
                            {attr.feature_name || attr.featureName}
                          </span>
                          <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", background: "rgba(255, 255, 255, 0.08)", color: "var(--color-text-tertiary)" }}>
                            {attr.category}
                          </span>
                        </div>
                        <div className="body-sm text-secondary" style={{ marginTop: "2px" }}>
                          {attr.detail_description || attr.detailDescription}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            color: isPositive ? "var(--color-emerald-400)" : "var(--color-rose-400)"
                          }}
                        >
                          {attr.formatted_amount || attr.formattedAmount}
                        </span>
                        <span className="body-xs text-tertiary" style={{ display: "block" }}>
                          {attr.percentage}% of net variance
                        </span>
                      </div>
                    </div>

                    {/* Progress Fill Bar */}
                    <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.06)", borderRadius: "3px", overflow: "hidden", marginTop: "4px" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
                        style={{
                          height: "100%",
                          borderRadius: "3px",
                          background: isPositive
                            ? "linear-gradient(90deg, #10b981, #34d399)"
                            : "linear-gradient(90deg, #f43f5e, #fb7185)"
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Property summary */}
        <motion.div 
          className="results-property-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="heading-4" style={{ marginBottom: "var(--space-6)" }}>
            <Home size={20} style={{ marginRight: "var(--space-2)" }} />
            Subject Property Specifications
          </h3>
          <div className="results-property-grid">
            <PropertyDetail
              icon={<Home size={18} />}
              label="Living Area"
              value={`${formData?.gr_liv_area || valuation.grLivArea || "—"} sq ft`}
            />
            <PropertyDetail
              icon={<BedDouble size={18} />}
              label="Bedrooms"
              value={formData?.bedrooms ?? valuation.bedrooms ?? "—"}
            />
            <PropertyDetail
              icon={<Bath size={18} />}
              label="Bathrooms"
              value={formData?.full_bath ?? valuation.fullBath ?? "—"}
            />
            <PropertyDetail
              icon={<Calendar size={18} />}
              label="Year Built"
              value={formData?.year_built ?? valuation.yearBuilt ?? "—"}
            />
            <PropertyDetail
              icon={<Star size={18} />}
              label="Quality Rating"
              value={`${formData?.overall_qual ?? valuation.overallQual ?? "—"} / 10`}
            />
            <PropertyDetail
              icon={<MapPin size={18} />}
              label="Address"
              value={valuation.address || formData?.address || "1234 Ames Way, IA"}
            />
          </div>
        </motion.div>

        {/* Actions Row */}
        <motion.div 
          className="results-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", justifyContent: "center" }}
        >
          <button
            className="btn btn--primary btn--lg"
            onClick={() => generateValuationPDF(valuation, formData)}
          >
            <Download size={18} />
            Download PDF Report
          </button>

          <button
            className="btn btn--secondary btn--lg"
            onClick={handleEmailReport}
            disabled={emailStatus === "sending"}
          >
            <Mail size={18} />
            {emailStatus === "sending" ? "Dispatching Email..." : "Email Report to Inbox"}
          </button>

          <button
            className="btn btn--ghost btn--lg"
            onClick={() => navigate("/estimate")}
          >
            <RotateCcw size={18} />
            New Valuation
          </button>

          <Link to="/" className="btn btn--ghost btn--lg">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function PropertyDetail({ icon, label, value }) {
  return (
    <div className="results-property-detail">
      <div className="results-property-detail-icon">{icon}</div>
      <div>
        <span className="body-xs text-tertiary">{label}</span>
        <span className="body-base" style={{ fontWeight: 600, display: "block" }}>
          {value}
        </span>
      </div>
    </div>
  );
}
