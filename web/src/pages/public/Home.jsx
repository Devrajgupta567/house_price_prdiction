import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ShieldCheck,
  MapPin,
  FileSpreadsheet,
  ArrowRight,
  BarChart3,
  Layers,
  Building,
  CheckCircle2,
} from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";
import ParticleMeshSphere from "../../components/ParticleMeshSphere";

/* ──────── Trust & Features Data ──────── */

const TRUST_ITEMS = [
  { icon: <BarChart3 size={20} />, text: "Data-driven estimates" },
  { icon: <Building size={20} />, text: "Comparable property analysis" },
  { icon: <MapPin size={20} />, text: "Neighborhood insights" },
  { icon: <ShieldCheck size={20} />, text: "Secure data handling" },
];

const STEPS = [
  {
    num: "1",
    title: "Enter property details",
    text: "Tell us about your home — location, living area, bedrooms, condition, and recent improvements.",
  },
  {
    num: "2",
    title: "Review your information",
    text: "Confirm your property data. We show a completeness score to verify what optimizes estimate accuracy.",
  },
  {
    num: "3",
    title: "Receive your estimate",
    text: "Get an estimated market value with price range, comparable properties, and neighborhood trends.",
  },
];

const FEATURES = [
  {
    icon: <BarChart3 size={24} />,
    title: "Property Valuation",
    text: "Analytical engine trained on thousands of residential sales, delivering a calibrated price range with confidence rating.",
  },
  {
    icon: <Building size={24} />,
    title: "Comparable Properties",
    text: "Inspect verified sold homes near your coordinates, with distance, square footage, and similarity scoring.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Neighborhood Trends",
    text: "Live median valuation trends, annual price shifts, active sales volume, and historical market velocity.",
  },
  {
    icon: <Layers size={24} />,
    title: "Valuation History",
    text: "Track your home's equity trajectory across changing interest rates and seasonal market movements.",
  },
  {
    icon: <FileSpreadsheet size={24} />,
    title: "Downloadable Reports",
    text: "Export high-resolution PDF dossiers for financial planning, mortgage reviews, or agent consultations.",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Privacy First",
    text: "Your address and interior specifications are protected with 256-bit encryption and never shared without consent.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── 3D Kinetic Hero Section ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid-layout">
            {/* Hero Left Column (Copy + CTAs + Stats) */}
            <div className="hero__content">
              <h1 className="hero__title">
                Know what your <em>home is worth.</em>
              </h1>

              <p className="hero__subtitle">
                Accurate, data-backed residential valuation powered by comparable market analysis,
                neighborhood indexing, and real-time computational analytics.
              </p>

              {/* Direct Clean Action Buttons */}
              <div className="hero__actions" style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
                <Link to="/estimate" className="btn btn--accent btn--lg">
                  <span>Get Home Estimate</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/sample-report" className="btn btn--secondary btn--lg">
                  <span>View Sample Report</span>
                </Link>
              </div>

              <div className="hero__stats">
                <div>
                  <div className="hero__stat-value">2,930+</div>
                  <div className="hero__stat-label">Properties analyzed</div>
                </div>
                <div>
                  <div className="hero__stat-value">85.6%</div>
                  <div className="hero__stat-label">Accuracy</div>
                </div>
                <div>
                  <div className="hero__stat-value">&lt; 30s</div>
                  <div className="hero__stat-label">Instant generation</div>
                </div>
              </div>
            </div>

            {/* Hero Right Column (Clean 3D Three.js Particle Mesh Sphere without overlays) */}
            <div className="hero-3d-visual">
              <div className="sphere-glow-backdrop" />
              <ParticleMeshSphere />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-bar__items">
            {TRUST_ITEMS.map(({ icon, text }) => (
              <div key={text} className="trust-bar__item">
                <span className="trust-bar__icon">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section section--lg">
        <div className="container">
          <ScrollReveal>
            <div className="section-heading">
              <span className="section-heading__label">Workflow</span>
              <h2 className="section-heading__title">Three simple steps to your estimate</h2>
              <p className="section-heading__subtitle">
                No appraisals, no waiting. Enter property details and receive an immediate
                valuation backed by real comparable transactions and neighborhood signals.
              </p>
            </div>
          </ScrollReveal>

          <div className="steps">
            {STEPS.map(({ num, title, text }, i) => (
              <ScrollReveal key={num} delay={i * 120}>
                <div className="step">
                  <div className="step__number">{num}</div>
                  <h3 className="step__title">{title}</h3>
                  <p className="step__text">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section section--lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-heading">
              <span className="section-heading__label">Features</span>
              <h2 className="section-heading__title">Engineered for complete market transparency</h2>
              <p className="section-heading__subtitle">
                From micro-neighborhood pricing gradients to comparable match scores, discover every factor shaping your property's value.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid--3">
            {FEATURES.map(({ icon, title, text }, i) => (
              <ScrollReveal key={title} delay={i * 80}>
                <div className="feature-card">
                  <div className="feature-card__icon">{icon}</div>
                  <h3 className="feature-card__title">{title}</h3>
                  <p className="feature-card__text">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Valuation Preview ── */}
      <section className="section section--lg">
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          <ScrollReveal>
            <div className="section-heading">
              <span className="section-heading__label">Sample Report</span>
              <h2 className="section-heading__title">See what you will receive</h2>
              <p className="section-heading__subtitle">
                Every valuation includes an estimated price range, verified comparable homes, and neighborhood micro-trends.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="report-preview">
              <div className="report-preview__header">
                <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-accent)", marginBottom: "var(--space-2)", fontWeight: 700 }}>
                  Estimated Market Value
                </div>
                <div className="report-preview__price">$485,000</div>
                <div className="report-preview__range">Range: $462,000 — $508,000</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", marginTop: "var(--space-4)", flexWrap: "wrap" }}>
                  <span className="badge badge--gold">Moderate Confidence</span>
                  <span className="badge badge--brand">Active Market Feed</span>
                  <span className="badge badge--success">94% Comp Similarity</span>
                </div>
              </div>

              <div className="report-preview__body">
                <div className="grid grid--3" style={{ gap: "var(--space-6)" }}>
                  <div className="stat-card">
                    <div className="stat-card__value">12</div>
                    <div className="stat-card__label">Comparable properties</div>
                    <div className="stat-card__change stat-card__change--up">Within 1.0 mile radius</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card__value">$478K</div>
                    <div className="stat-card__label">Median neighborhood value</div>
                    <div className="stat-card__change stat-card__change--up">↑ 4.2% YoY</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card__value">23</div>
                    <div className="stat-card__label">Avg. days on market</div>
                    <div className="stat-card__change stat-card__change--down">↓ 8 days faster</div>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
                  <button
                    className="btn btn--primary btn--lg"
                    onClick={() => navigate("/sample-report")}
                  >
                    <span>View Full Sample Report</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Privacy & Security ── */}
      <section className="section" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          <ScrollReveal>
            <div style={{ display: "flex", gap: "var(--space-12)", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 340px" }}>
                <span className="section-heading__label" style={{ display: "block", textAlign: "left", marginBottom: "var(--space-3)" }}>
                  Security & Privacy
                </span>
                <h2 className="heading-3" style={{ marginBottom: "var(--space-4)" }}>
                  Your property data belongs to you
                </h2>
                <p className="body-lg text-secondary" style={{ marginBottom: "var(--space-6)" }}>
                  We prioritize rigorous data privacy. Your personal records and interior property details are encrypted and never monetized.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {["256-bit AES encryption at rest and in transit", "No data shared with marketing aggregators", "Instant one-click data deletion", "Masked street number options"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <CheckCircle2 size={18} color="var(--color-emerald-500)" />
                      <span className="body-sm" style={{ fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: "1 1 340px", display: "flex", justifyContent: "center" }}>
                <div className="glass-card" style={{
                  width: 260, height: 260, borderRadius: "var(--radius-2xl)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "var(--shadow-xl)"
                }}>
                  <ShieldCheck size={88} color="var(--color-gold-500)" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="section section--lg" style={{
        background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))",
        textAlign: "center",
        borderTop: "1px solid var(--border-default)"
      }}>
        <div className="container container--narrow">
          <ScrollReveal>
            <h2 className="heading-2" style={{ marginBottom: "var(--space-4)" }}>
              Ready to discover your home's true value?
            </h2>
            <p className="body-lg text-secondary" style={{ marginBottom: "var(--space-8)" }}>
              Get your comprehensive property valuation in under 2 minutes. No credit card required.
            </p>
            <button
              className="btn btn--accent btn--lg"
              onClick={() => navigate("/estimate")}
            >
              <span>Get Your Free Estimate</span>
              <ArrowRight size={18} />
            </button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
