import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";
import Accordion from "../../components/Accordion";

const INFO_ITEMS = [
  "Property address and neighborhood zone",
  "Total indoor living area (square feet)",
  "Bedroom and full/half bathroom counts",
  "Original construction year and major remodel dates",
  "Lot area and garage capacity",
  "Overall architectural condition and recent upgrades",
];

const FAQ_ITEMS = [
  {
    question: "Is this a formal appraisal?",
    answer: "No. ValuAltion provides a real-time data-driven market valuation utilizing comparable sales, physical property characteristics, and neighborhood statistical trends. It serves as an informative benchmark for homeowners and investors. For official mortgage financing or tax assessment disputes, consult a state-licensed certified appraiser.",
  },
  {
    question: "How accurate is the estimate?",
    answer: "Our valuation model achieves an industry-leading 85.6% benchmark accuracy score across residential test splits in Ames, Iowa. The model calculates precision ranges based on comparable density and data completeness, always supplying a confidence rating with each report.",
  },
  {
    question: "What data points are analyzed?",
    answer: "We analyze comprehensive residential sales comprising over 2,930 transactions with up to 80 detailed attributes — including living area, basement finishes, lot contours, roof quality, heating systems, and neighborhood sales velocity.",
  },
  {
    question: "How fast is the valuation process?",
    answer: "Submitting the guided property form takes approximately 2 to 3 minutes. The computation and comparable property matching completes in under 30 seconds.",
  },
  {
    question: "Is my property data kept private?",
    answer: "Yes. All data transmissions are encrypted using 256-bit SSL/TLS. We do not sell homeowner records to third-party data brokers or marketing lists. You can purge or export your data at any time.",
  },
  {
    question: "Do I need a paid subscription?",
    answer: "Basic homeowner property valuations and sample report exploration are 100% free. Optional professional workspace tiers are available for commercial agents and high-volume real-estate portfolios.",
  },
];

export default function HowItWorks() {
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
            <span className="section-heading__label">Step-By-Step Workflow</span>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              How ValuAltion works
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 560, margin: "0 auto" }}>
              We match your property details with verified neighborhood sales and market metrics 
              to deliver a calibrated market valuation in seconds.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Steps Detail */}
      <section className="section section--lg">
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          {[
            {
              num: "01",
              title: "Input property specifications",
              text: "Complete our guided form capturing square footage, bedroom/bath configuration, construction epoch, and recent remodeling.",
              badgeColor: "var(--badge-brand-bg)",
              textColor: "var(--text-accent)",
            },
            {
              num: "02",
              title: "Identify comparable transactions",
              text: "Our algorithm evaluates recently settled sales within your immediate proximity, calculating multidimensional similarity scores.",
              badgeColor: "var(--badge-gold-bg)",
              textColor: "var(--color-gold-500)",
            },
            {
              num: "03",
              title: "Synthesize neighborhood market trends",
              text: "We benchmark days on market, historical price appreciation, and local inventory levels to calibrate current valuation ranges.",
              badgeColor: "var(--badge-brand-bg)",
              textColor: "var(--text-accent)",
            },
            {
              num: "04",
              title: "Receive full valuation dossier",
              text: "Access an interactive valuation report featuring confidence scores, comparable breakdown tables, and downloadable PDF summaries.",
              badgeColor: "var(--badge-success-bg)",
              textColor: "var(--color-emerald-500)",
            },
          ].map(({ num, title, text, badgeColor, textColor }, i) => (
            <ScrollReveal key={num} delay={i * 100}>
              <div className="glass-card" style={{
                display: "flex", gap: "var(--space-8)", alignItems: "flex-start",
                padding: "var(--space-8)", marginBottom: "var(--space-6)", flexWrap: "wrap",
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "var(--radius-xl)",
                  backgroundColor: badgeColor, display: "flex", alignItems: "center",
                  justifyContent: "center", fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl)", fontWeight: 700, color: textColor,
                  flexShrink: 0,
                }}>
                  {num}
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <h3 className="heading-5" style={{ marginBottom: "var(--space-2)" }}>{title}</h3>
                  <p className="body-base text-secondary">{text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Required Information */}
      <section className="section" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          <ScrollReveal>
            <div style={{ display: "flex", gap: "var(--space-12)", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: "1 1 340px" }}>
                <span className="section-heading__label" style={{ display: "block", textAlign: "left", marginBottom: "var(--space-3)" }}>
                  Data Requirements
                </span>
                <h2 className="heading-3" style={{ marginBottom: "var(--space-4)" }}>Property information checklist</h2>
                <p className="body-base text-secondary" style={{ marginBottom: "var(--space-6)" }}>
                  Providing thorough property specifications improves estimation precision. 
                  Minimal required inputs are address and living area.
                </p>
              </div>
              <div style={{ flex: "1 1 340px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {INFO_ITEMS.map((item, i) => (
                    <div key={i} className="glass-card" style={{
                      display: "flex", alignItems: "center", gap: "var(--space-3)",
                      padding: "var(--space-4)",
                    }}>
                      <CheckCircle2 size={20} color="var(--color-gold-500)" />
                      <span className="body-sm" style={{ fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Confidence Explanation */}
      <section className="section">
        <div className="container container--narrow">
          <ScrollReveal>
            <div className="section-heading">
              <span className="section-heading__label">Precision Index</span>
              <h2 className="section-heading__title">Understanding your confidence rating</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid--3">
            {[
              { level: "High Confidence", badge: "badge--success", text: "Dense pool of recent, highly similar sales within 0.5 miles. Estimate band is tight (±3%)." },
              { level: "Moderate Confidence", badge: "badge--warning", text: "Adequate comparables available with minor adjustments for size or finish differences (±5%)." },
              { level: "Low Confidence", badge: "badge--error", text: "Unique property or sparse historical neighborhood volume. Broader price spread (±10%)." },
            ].map(({ level, badge, text }, i) => (
              <ScrollReveal key={level} delay={i * 100}>
                <div className="card" style={{ textAlign: "center", height: "100%" }}>
                  <span className={`badge ${badge}`} style={{ marginBottom: "var(--space-4)", display: "inline-flex" }}>{level}</span>
                  <p className="body-sm text-secondary">{text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          <ScrollReveal>
            <div className="section-heading">
              <span className="section-heading__label">FAQ</span>
              <h2 className="section-heading__title">Frequently asked questions</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div style={{ maxWidth: 740, margin: "0 auto" }}>
              <Accordion items={FAQ_ITEMS} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container container--narrow">
          <ScrollReveal>
            <h2 className="heading-3" style={{ marginBottom: "var(--space-4)" }}>Ready to value your property?</h2>
            <p className="body-lg text-secondary" style={{ marginBottom: "var(--space-8)" }}>
              No credit card or commitment required.
            </p>
            <Link
              to="/estimate"
              className="btn btn--accent btn--lg"
            >
              <span>Start Your Valuation</span>
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
