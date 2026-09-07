import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  DollarSign, TrendingUp, TrendingDown, Home, BedDouble, Bath,
  Calendar, Star, MapPin, ArrowLeft, RotateCcw, Shield, BarChart3, Download
} from "lucide-react";
import { motion } from "framer-motion";
import { generateValuationPDF } from "../../utils/pdfGenerator";

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const valuation = location.state?.valuation;
  const formData = location.state?.formData;

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
  const confidence = valuation.confidenceScore || 0.85;  // always 0.0 – 1.0
  const confidenceLevel = valuation.confidenceLevel || "HIGH";
  const confidencePct = Math.round(confidence * 100);

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

  return (
    <section className="results-page">
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
          <h1 className="heading-2">Valuation Results</h1>
          <p className="body-lg text-secondary">
            AI-powered property value estimation
          </p>
        </motion.div>

        {/* Main price card */}
        <motion.div 
          className="results-price-card glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
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
                  : "—"}
              </span>
              <span className="body-xs text-tertiary">per sq ft</span>
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
              <span className="body-xs text-tertiary">Neighborhood</span>
              <span className="heading-4">
                {valuation.neighborhood || formData?.neighborhood || "—"}
              </span>
              <span className="body-xs text-tertiary">Ames, Iowa</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Property summary */}
        <motion.div 
          className="results-property-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="heading-4" style={{ marginBottom: "var(--space-6)" }}>
            <Home size={20} style={{ marginRight: "var(--space-2)" }} />
            Property Summary
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
              label="Quality"
              value={`${formData?.overall_qual ?? valuation.overallQual ?? "—"} / 10`}
            />
            <PropertyDetail
              icon={<MapPin size={18} />}
              label="Address"
              value={valuation.address || formData?.address || "1234 Ames Way"}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="results-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
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
