import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, MapPin, Layers, Calendar, Star, Shield,
  Wind, Flame, Car, Sparkles, ArrowRight, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { valuationAPI } from "../../services/api";

const NEIGHBORHOODS = [
  { code: "Blmngtn",  name: "Bloomington Heights (Blmngtn)",     desc: "Active adult community & patio homes" },
  { code: "Blueste",  name: "Bluestem (Blueste)",                 desc: "Quiet condominium development" },
  { code: "BrDale",   name: "Briardale (BrDale)",                 desc: "Convenient suburban townhomes" },
  { code: "BrkSide",  name: "Brookside (BrkSide)",                desc: "Historic charm near downtown Ames" },
  { code: "ClearCr",  name: "Clear Creek (ClearCr)",              desc: "Secluded wooded properties & large lots" },
  { code: "CollgCr",  name: "College Creek (CollgCr)",            desc: "Popular modern family community" },
  { code: "Crawfor",  name: "Crawford (Crawfor)",                 desc: "Scenic established wooded enclave" },
  { code: "Edwards",  name: "Edwards (Edwards)",                  desc: "Affordable classic post-war residential" },
  { code: "Gilbert",  name: "Gilbert (Gilbert)",                  desc: "Peaceful north Ames family district" },
  { code: "GrnHill",  name: "Green Hills (GrnHill)",              desc: "Private retirement village" },
  { code: "Greens",   name: "Greens (Greens)",                    desc: "Golf course adjacent community" },
  { code: "IDOTRR",   name: "Iowa DOT & Rail Road (IDOTRR)",      desc: "Urban commercial and transit corridor" },
  { code: "Landmrk",  name: "Landmark (Landmrk)",                 desc: "Historic central landmark parcels" },
  { code: "MeadowV",  name: "Meadow Village (MeadowV)",           desc: "Multi-family townhome community" },
  { code: "Mitchel",  name: "Mitchell (Mitchel)",                 desc: "South Ames suburban residential" },
  { code: "NAmes",    name: "North Ames (NAmes)",                 desc: "Largest classic residential neighborhood" },
  { code: "NoRidge",  name: "Northridge (NoRidge)",               desc: "Premier luxury estates" },
  { code: "NPkVill",  name: "Northpark Villa (NPkVill)",          desc: "Townhome community near parks" },
  { code: "NridgHt",  name: "Northridge Heights (NridgHt)",       desc: "Prestigious executive contemporary homes" },
  { code: "NWAmes",   name: "Northwest Ames (NWAmes)",            desc: "Established suburban district" },
  { code: "OldTown",  name: "Old Town (OldTown)",                 desc: "Historic core architectural district" },
  { code: "SWISU",    name: "South & West of ISU (SWISU)",        desc: "Campus adjacent university district" },
  { code: "Sawyer",   name: "Sawyer (Sawyer)",                    desc: "1970s suburban family community" },
  { code: "SawyerW",  name: "Sawyer West (SawyerW)",              desc: "Convenient west Ames residential" },
  { code: "Somerst",  name: "Somerset (Somerst)",                 desc: "Master-planned walkable urban village" },
  { code: "StoneBr",  name: "Stone Brook (StoneBr)",              desc: "High-end luxury hillside homes" },
  { code: "Timber",   name: "Timberland (Timber)",                desc: "Scenic south Ames nature corridor" },
  { code: "Veenker",  name: "Veenker (Veenker)",                  desc: "Exclusive golf course community" },
];

/* Custom clean number counter control (no native browser spinners) */
function CounterControl({ label, icon: Icon, value, min = 0, max = 10, onChange, unit = "" }) {
  const dec = () => { if (value > min) onChange(value - 1); };
  const inc = () => { if (value < max) onChange(value + 1); };

  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {Icon && <Icon size={14} style={{ color: "var(--text-accent)" }} />}
        {label}
      </label>
      <div className="form-number-control">
        <button type="button" className="form-number-control__btn" onClick={dec} disabled={value <= min}>
          −
        </button>
        <div className="form-number-control__input">
          {value} {unit}
        </div>
        <button type="button" className="form-number-control__btn" onClick={inc} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  );
}

export default function EstimatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "1234 Ames Way",
    neighborhood: "NoRidge",
    gr_liv_area: "2198",
    lot_area: "14260",
    total_bsmt_sf: "1145",
    bedrooms: 4,
    full_bath: 2,
    half_bath: 1,
    year_built: "2000",
    year_remod: "",
    overall_qual: 8,
    overall_cond: 5,
    garage_cars: 3,
    fireplaces: 1,
    central_air: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleQualityChange = (val) => setForm((prev) => ({ ...prev, overall_qual: val }));
  const handleConditionChange = (val) => setForm((prev) => ({ ...prev, overall_cond: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gr_liv_area || Number(form.gr_liv_area) < 100) {
      setError("Please enter a valid living area (min 100 sq ft).");
      return;
    }
    const yb = Number(form.year_built);
    if (!yb || yb < 1800 || yb > 2026) {
      setError("Please enter a valid Year Built (1800-2026).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        gr_liv_area: Number(form.gr_liv_area),
        lot_area: Number(form.lot_area || 8500),
        total_bsmt_sf: Number(form.total_bsmt_sf || 0),
        bedrooms: Number(form.bedrooms),
        full_bath: Number(form.full_bath),
        half_bath: Number(form.half_bath),
        year_built: Number(form.year_built),
        year_remod: form.year_remod ? Number(form.year_remod) : null,
        overall_qual: Number(form.overall_qual),
        overall_cond: Number(form.overall_cond),
        garage_cars: Number(form.garage_cars),
        fireplaces: Number(form.fireplaces || 0),
        central_air: Boolean(form.central_air),
        neighborhood: form.neighborhood,
        address: form.address || "1234 Ames Way",
      };

      const result = await valuationAPI.estimate(payload);
      navigate("/results", { state: { valuation: result, formData: payload } });
    } catch (err) {
      setError(err.message || "Valuation computation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="wizard-page">
      <div className="container">
        
        {/* Header */}
        <motion.div 
          className="wizard-header" style={{ maxWidth: "800px", margin: "0 auto var(--space-6)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge badge--accent" style={{ marginBottom: "var(--space-2)" }}>
            <Sparkles size={13} />
            <span>AI Valuation Studio</span>
          </div>
          <h1 className="heading-2">Property Valuation Calculator</h1>
          <p className="body-lg text-secondary">
            Enter your house specifications below. Our machine learning model will analyze historical market comps and deliver an accurate market valuation.
          </p>
        </motion.div>

        {error && (
          <div className="auth-error" style={{ maxWidth: "900px", margin: "0 auto var(--space-6)" }}>
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <motion.div 
            className="valuation-studio-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            
            {/* ── Left Column: Dimensions & Layout ───────────────────────────── */}
            <motion.div 
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              
              {/* Location & Address */}
              <div className="valuation-card-section glass-card">
                <div className="valuation-card-section__title">
                  <div className="valuation-card-section__icon">
                    <MapPin size={16} />
                  </div>
                  <span>Location &amp; District</span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Street Address</label>
                  <div className="form-input-wrapper">
                    <Home size={16} className="form-input-icon" />
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 1234 Ames Way"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="neighborhood">Neighborhood Submarket</label>
                  <div className="form-input-wrapper">
                    <MapPin size={16} className="form-input-icon" />
                    <select
                      id="neighborhood"
                      name="neighborhood"
                      className="form-input form-select"
                      value={form.neighborhood}
                      onChange={handleChange}
                    >
                      {NEIGHBORHOODS.map((n) => (
                        <option key={n.code} value={n.code}>
                          {n.name} — {n.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Floor Plan Dimensions */}
              <div className="valuation-card-section glass-card">
                <div className="valuation-card-section__title">
                  <div className="valuation-card-section__icon">
                    <Layers size={16} />
                  </div>
                  <span>Dimensions &amp; Living Space</span>
                </div>

                <div className="profile-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="gr_liv_area">Above-Ground Living Area (sq ft) *</label>
                    <input
                      id="gr_liv_area"
                      name="gr_liv_area"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 2198"
                      value={form.gr_liv_area}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="total_bsmt_sf">Basement Total Area (sq ft)</label>
                    <input
                      id="total_bsmt_sf"
                      name="total_bsmt_sf"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 1145"
                      value={form.total_bsmt_sf}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lot_area">Lot / Land Size (sq ft)</label>
                  <input
                    id="lot_area"
                    name="lot_area"
                    type="number"
                    className="form-input"
                    placeholder="e.g. 14260"
                    value={form.lot_area}
                    onChange={handleChange}
                  />
                </div>

                {/* Rooms Counters */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
                  <CounterControl
                    label="Bedrooms"
                    value={form.bedrooms}
                    min={1}
                    max={8}
                    onChange={(v) => setForm((p) => ({ ...p, bedrooms: v }))}
                  />
                  <CounterControl
                    label="Full Bathrooms"
                    value={form.full_bath}
                    min={1}
                    max={6}
                    onChange={(v) => setForm((p) => ({ ...p, full_bath: v }))}
                  />
                  <CounterControl
                    label="Half Bathrooms"
                    value={form.half_bath}
                    min={0}
                    max={4}
                    onChange={(v) => setForm((p) => ({ ...p, half_bath: v }))}
                  />
                  <CounterControl
                    label="Fireplaces"
                    icon={Flame}
                    value={form.fireplaces}
                    min={0}
                    max={4}
                    onChange={(v) => setForm((p) => ({ ...p, fireplaces: v }))}
                  />
                </div>
              </div>

            </motion.div>

            {/* ── Right Column: Quality, Age & Features ──────────────────────── */}
            <motion.div 
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              
              {/* Construction Quality & Condition */}
              <div className="valuation-card-section glass-card">
                <div className="valuation-card-section__title">
                  <div className="valuation-card-section__icon">
                    <Star size={16} />
                  </div>
                  <span>Quality &amp; Condition Rating</span>
                </div>

                <div className="form-group">
                  <div className="flex--between" style={{ marginBottom: "var(--space-2)" }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Build Quality Rating</label>
                    <span className="body-sm text-accent" style={{ fontWeight: 700 }}>
                      {form.overall_qual} / 10 — {form.overall_qual >= 8 ? "Very Good/Excellent" : form.overall_qual >= 6 ? "Good/Above Average" : "Standard"}
                    </span>
                  </div>
                  <div className="quality-chip-selector">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                      <button
                        key={q}
                        type="button"
                        className={`quality-chip ${form.overall_qual === q ? "quality-chip--active" : ""}`}
                        onClick={() => handleQualityChange(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div className="flex--between" style={{ marginBottom: "var(--space-2)" }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Overall Condition</label>
                    <span className="body-sm text-secondary" style={{ fontWeight: 600 }}>
                      {form.overall_cond} / 10
                    </span>
                  </div>
                  <div className="quality-chip-selector">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`quality-chip ${form.overall_cond === c ? "quality-chip--active" : ""}`}
                        onClick={() => handleConditionChange(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Age, Parking & Climate */}
              <div className="valuation-card-section glass-card">
                <div className="valuation-card-section__title">
                  <div className="valuation-card-section__icon">
                    <Calendar size={16} />
                  </div>
                  <span>Age, Garage &amp; Amenities</span>
                </div>

                <div className="profile-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="year_built">Year Built *</label>
                    <input
                      id="year_built"
                      name="year_built"
                      type="number"
                      className="form-input"
                      placeholder="e.g. 2000"
                      value={form.year_built}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="year_remod">Year Renovated</label>
                    <input
                      id="year_remod"
                      name="year_remod"
                      type="number"
                      className="form-input"
                      placeholder="Leave blank if never"
                      value={form.year_remod}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", marginTop: "var(--space-2)" }}>
                  <CounterControl
                    label="Garage Capacity"
                    icon={Car}
                    value={form.garage_cars}
                    min={0}
                    max={5}
                    unit="car(s)"
                    onChange={(v) => setForm((p) => ({ ...p, garage_cars: v }))}
                  />

                  {/* Central A/C Toggle */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Wind size={14} style={{ color: "var(--text-accent)" }} />
                      Central Air (A/C)
                    </label>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <button
                        type="button"
                        className={`btn btn--full central-air-btn ${form.central_air ? "central-air-btn--active" : ""}`}
                        style={{ height: "46px" }}
                        onClick={() => setForm((p) => ({ ...p, central_air: true }))}
                      >
                        ✓ Yes (+3.5%)
                      </button>
                      <button
                        type="button"
                        className={`btn btn--full central-air-btn ${!form.central_air ? "central-air-btn--active" : ""}`}
                        style={{ height: "46px" }}
                        onClick={() => setForm((p) => ({ ...p, central_air: false }))}
                      >
                        ✗ No
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA Card */}
              <div className="glass-card" style={{ padding: "var(--space-6)", borderRadius: "var(--radius-xl)", background: "linear-gradient(135deg, rgba(197, 165, 90, 0.15), rgba(26, 26, 46, 0.95))", border: "1px solid rgba(197, 165, 90, 0.4)" }}>
                <div className="flex--between" style={{ marginBottom: "var(--space-4)" }}>
                  <div>
                    <h3 className="heading-4" style={{ margin: 0 }}>Ready to Estimate?</h3>
                    <p className="body-xs text-secondary" style={{ margin: "4px 0 0" }}>
                      Instant AI analysis with comparable sales &amp; market ranges.
                    </p>
                  </div>
                  <Shield size={24} style={{ color: "var(--text-accent)" }} />
                </div>

                <button
                  type="submit"
                  id="get-valuation-btn"
                  className="btn btn--accent btn--full btn--lg"
                  disabled={loading}
                  style={{ gap: "var(--space-2)" }}
                >
                  {loading ? (
                    <span className="btn-loading-spinner" />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Calculate Property Valuation</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

            </motion.div>

          </motion.div>
        </form>

      </div>
    </section>
  );
}
