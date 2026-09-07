import { Link } from "react-router-dom";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Cpu,
  Database,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Building2,
  Lock
} from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

const STATS = [
  { value: "10,000+", label: "Historical Transactions Trained" },
  { value: "85.6%", label: "Model Calibrated Accuracy" },
  { value: "< 30s", label: "Instant Valuation Synthesis" },
  { value: "28", label: "Ames Submarkets Analyzed" },
];

const PILLARS = [
  {
    icon: <Cpu size={26} />,
    title: "Algorithmic Precision",
    text: "We replace subjective guesswork with gradient-boosted decision trees trained on multi-variable residential sales data. Every estimate incorporates living space, build quality, structural condition, and zoning characteristics.",
  },
  {
    icon: <TrendingUp size={26} />,
    title: "Market Vector Modeling",
    text: "Home values do not exist in isolation. Our models cross-reference hyper-local neighborhood appreciation vectors, recent comparable sales within 1.5 miles, and seasonal sales velocity.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Transparent & Unbiased",
    text: "Traditional real estate platforms often inflate or skew estimates to steer mortgage leads or broker referrals. ValuAltion operates with zero broker steering—our only allegiance is mathematical integrity.",
  },
  {
    icon: <Lock size={26} />,
    title: "Homeowner Privacy First",
    text: "Your property queries and financial portfolio tracking are safeguarded by enterprise encryption, strict role-based access control, and zero data-brokering policies.",
  },
];

const TEAM_VALUES = [
  {
    icon: <Compass size={22} />,
    title: "Data Integrity Over Hype",
    desc: "We prioritize rigorous cross-validation and honest confidence intervals rather than presenting misleading single-number certainties.",
  },
  {
    icon: <Database size={22} />,
    title: "Continuous Machine Learning",
    desc: "Our automated ML pipelines continuously retrain and evaluate models against fresh market transactions using reproducible ZenML pipelines.",
  },
  {
    icon: <Users size={22} />,
    title: "Empowering Everyday Homeowners",
    desc: "Institutional investors have had algorithmic pricing models for decades. We believe homeowners deserve that same caliber of financial intelligence.",
  },
];

export default function About() {
  return (
    <>
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "calc(var(--navbar-height) + var(--space-16))",
          paddingBottom: "var(--space-16)",
          background: "var(--bg-hero)",
          borderBottom: "1px solid var(--border-default)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <div className="badge badge--brand" style={{ marginBottom: "var(--space-3)" }}>
              <Sparkles size={13} />
              <span>Our Mission &amp; Technology</span>
            </div>
            <h1 className="heading-1" style={{ marginBottom: "var(--space-4)" }}>
              Bringing institutional <em style={{ color: "var(--color-gold-500)", fontStyle: "normal" }}>intelligence</em> to residential real estate.
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 640, margin: "0 auto var(--space-8)" }}>
              ValuAltion was founded to demystify residential property valuation through calibrated machine learning, verifiable market comparables, and total algorithmic transparency.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/estimate" className="btn btn--accent btn--lg">
                <Sparkles size={18} />
                <span>Try the Valuation Tool</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/sample-report" className="btn btn--secondary btn--lg">
                Explore Sample Report
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid var(--border-default)", background: "var(--bg-secondary)", padding: "var(--space-8) 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-6)", textAlign: "center" }}>
            {STATS.map((s, idx) => (
              <div key={idx}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: 800, color: "var(--color-gold-500)" }}>
                  {s.value}
                </div>
                <div className="body-sm text-secondary" style={{ marginTop: "4px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Pillars ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">Why ValuAltion</span>
            <h2 className="section-heading__title">
              Built on mathematical rigor, not promotional guesses.
            </h2>
            <p className="section-heading__subtitle">
              Most automated valuation tools are designed as lead generation engines for real estate agents. ValuAltion was engineered from the ground up as a pure data science platform.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
            {PILLARS.map((p, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="glass-card feature-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className="feature-card__icon" style={{ color: "var(--color-gold-500)" }}>
                    {p.icon}
                  </div>
                  <h3 className="feature-card__title" style={{ fontSize: "var(--text-xl)" }}>
                    {p.title}
                  </h3>
                  <p className="feature-card__text" style={{ flex: 1 }}>
                    {p.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture & Technology Stack ───────────────────────── */}
      <section className="section--sm" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          <div className="glass-card" style={{ padding: "var(--space-10)", borderRadius: "var(--radius-2xl)" }}>
            <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
              <span className="section-heading__label">Full-Stack Architecture</span>
              <h2 className="heading-2" style={{ marginTop: "var(--space-2)" }}>
                The ValuAltion Technology Engine
              </h2>
              <p className="body-base text-secondary" style={{ maxWidth: 560, margin: "var(--space-2) auto 0" }}>
                A multi-tier architecture uniting modern data science pipelines with enterprise-grade Java and reactive client synthesis.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-6)" }}>
              <div style={{ padding: "var(--space-6)", borderRadius: "var(--radius-xl)", background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
                <div style={{ color: "var(--color-gold-500)", marginBottom: "var(--space-3)" }}>
                  <Cpu size={28} />
                </div>
                <h4 className="heading-5" style={{ marginBottom: "var(--space-2)" }}>
                  ML Inference Engine
                </h4>
                <p className="body-sm text-secondary">
                  FastAPI service orchestrated with ZenML. Utilizes feature engineering, polynomial expansions, and ensemble trees to produce accurate predictions and confidence intervals.
                </p>
              </div>

              <div style={{ padding: "var(--space-6)", borderRadius: "var(--radius-xl)", background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
                <div style={{ color: "var(--color-indigo-500)", marginBottom: "var(--space-3)" }}>
                  <Building2 size={28} />
                </div>
                <h4 className="heading-5" style={{ marginBottom: "var(--space-2)" }}>
                  Spring Boot Backend
                </h4>
                <p className="body-sm text-secondary">
                  High-performance Java microservice handling JWT stateless authentication, OTP verification codes, role-based authorization, and user portfolio tracking.
                </p>
              </div>

              <div style={{ padding: "var(--space-6)", borderRadius: "var(--radius-xl)", background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
                <div style={{ color: "var(--color-emerald-500)", marginBottom: "var(--space-3)" }}>
                  <Award size={28} />
                </div>
                <h4 className="heading-5" style={{ marginBottom: "var(--space-2)" }}>
                  Interactive Client &amp; PDF
                </h4>
                <p className="body-sm text-secondary">
                  React 18 frontend with Vite and Vanilla CSS design tokens. Features client-side vector PDF synthesis for instant, bank-ready property dossier downloads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles & Values ────────────────────────────────────── */}
      <section className="section">
        <div className="container container--narrow">
          <div className="section-heading">
            <span className="section-heading__label">Guiding Principles</span>
            <h2 className="section-heading__title">
              What we stand for
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {TEAM_VALUES.map((v, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: "var(--space-6)",
                  display: "flex",
                  gap: "var(--space-4)",
                  alignItems: "flex-start",
                  borderRadius: "var(--radius-xl)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    background: "var(--badge-gold-bg)",
                    color: "var(--color-gold-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {v.icon}
                </div>
                <div>
                  <h3 className="heading-5" style={{ margin: "0 0 4px 0" }}>
                    {v.title}
                  </h3>
                  <p className="body-sm text-secondary" style={{ margin: 0, lineHeight: 1.6 }}>
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div
            className="glass-card"
            style={{
              marginTop: "var(--space-12)",
              padding: "var(--space-8)",
              borderRadius: "var(--radius-2xl)",
              textAlign: "center",
              background: "linear-gradient(135deg, rgba(197, 165, 90, 0.15), rgba(26, 26, 46, 0.85))",
              border: "1px solid rgba(197, 165, 90, 0.4)",
            }}
          >
            <h3 className="heading-3" style={{ marginBottom: "var(--space-2)" }}>
              Experience the ValuAltion Difference
            </h3>
            <p className="body-md text-secondary" style={{ maxWidth: 480, margin: "0 auto var(--space-6)" }}>
              Estimate your residence today or review an authentic sample market dossier.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/estimate" className="btn btn--accent btn--lg">
                Calculate Valuation
              </Link>
              <Link to="/contact" className="btn btn--secondary btn--lg">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
