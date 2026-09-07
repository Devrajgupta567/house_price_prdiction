import { Link } from "react-router-dom";
import {
  BarChart3,
  Building,
  TrendingUp,
  History,
  FileSpreadsheet,
  Layers,
  Map,
  ShieldCheck,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

const FEATURES = [
  {
    icon: <BarChart3 size={24} />,
    title: "Property Valuation",
    text: "Enter your property details and receive a calibrated market estimate based on analytical modeling of residential sales. Includes dynamic price spreads and confidence ratings.",
    tag: "Core",
  },
  {
    icon: <Building size={24} />,
    title: "Comparable Properties",
    text: "View similar homes that sold recently in your area. Each comparable includes sale price, distance, square footage, and a similarity score so you understand what drives your estimate.",
    tag: "Core",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Neighborhood Trends",
    text: "See how your neighborhood's property values have evolved over time, including median prices, days on market, sales volume, and annual trend indicators.",
    tag: "Core",
  },
  {
    icon: <History size={24} />,
    title: "Valuation History",
    text: "Track how your home's estimated equity changes across different runs and macroeconomic conditions. See historical curves and benchmark progression.",
    tag: "Dashboard",
  },
  {
    icon: <FileSpreadsheet size={24} />,
    title: "Downloadable Reports",
    text: "Export comprehensive PDF dossiers with your estimate, comparables, neighborhood metrics, and methodology explanations. Ready for advisors or lenders.",
    tag: "Dashboard",
  },
  {
    icon: <Layers size={24} />,
    title: "Multiple Properties",
    text: "Save and manage multiple residential assets from your portfolio dashboard. Compare performance side-by-side and set your primary residence.",
    tag: "Dashboard",
  },
  {
    icon: <Map size={24} />,
    title: "Interactive Maps",
    text: "Visualize your property, comparable transactions, and neighborhood boundaries with interactive spatial mapping to see proximity value drivers.",
    tag: "Core",
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Privacy & Security",
    text: "Your property records are encrypted and never shared with third-party aggregators. Mask your exact address and delete saved data at any time.",
    tag: "Always On",
  },
  {
    icon: <Briefcase size={24} />,
    title: "Professional Tools",
    text: "Dedicated workspace for brokers, lenders, and appraisers. Manage client portfolios, run batch valuations, export branded white-label reports, and collaborate.",
    tag: "Pro",
  },
];

const TAG_COLORS = {
  Core: "badge--brand",
  Dashboard: "badge--gold",
  "Always On": "badge--success",
  Pro: "badge--brand",
};

export default function Features() {
  return (
    <>
      {/* Header */}
      <section style={{
        paddingTop: "calc(var(--navbar-height) + var(--space-16))",
        paddingBottom: "var(--space-12)",
        background: "var(--bg-hero)",
        borderBottom: "1px solid var(--border-default)"
      }}>
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <span className="section-heading__label">Platform Capabilities</span>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              Built for homeowners. Ready for professionals.
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 560, margin: "0 auto" }}>
              Everything you need to understand, track, and communicate your property's true market standing.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="section section--lg">
        <div className="container">
          <div className="grid grid--3">
            {FEATURES.map(({ icon, title, text, tag }, i) => (
              <ScrollReveal key={title} delay={i * 60}>
                <div className="feature-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
                    <div className="feature-card__icon">{icon}</div>
                    <span className={`badge ${TAG_COLORS[tag] || "badge--neutral"}`}>{tag}</span>
                  </div>
                  <h3 className="feature-card__title">{title}</h3>
                  <p className="feature-card__text" style={{ flex: 1 }}>{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--lg" style={{
        background: "linear-gradient(135deg, var(--bg-secondary), var(--bg-primary))",
        textAlign: "center",
        borderTop: "1px solid var(--border-default)"
      }}>
        <div className="container container--narrow">
          <ScrollReveal>
            <h2 className="heading-2" style={{ marginBottom: "var(--space-4)" }}>
              Experience the platform
            </h2>
            <p className="body-lg text-secondary" style={{ marginBottom: "var(--space-8)" }}>
              Explore a live sample valuation report or estimate your home's value in minutes.
            </p>
            <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                to="/sample-report"
                className="btn btn--secondary btn--lg"
              >
                View Sample Report
              </Link>
              <Link
                to="/estimate"
                className="btn btn--accent btn--lg"
              >
                <span>Get Your Estimate</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
