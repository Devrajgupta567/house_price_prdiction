import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Building, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

/* ──── Mock Data ──── */

const COMPARABLES = [
  { address: "1234 Oak St", price: "$472,000", date: "Feb 2026", sqft: "1,820", beds: 3, baths: 2, distance: "0.3 mi", similarity: 94 },
  { address: "5678 Maple Ave", price: "$498,000", date: "Jan 2026", sqft: "1,950", beds: 4, baths: 2, distance: "0.5 mi", similarity: 89 },
  { address: "910 Elm Dr", price: "$465,000", date: "Mar 2026", sqft: "1,780", beds: 3, baths: 2, distance: "0.7 mi", similarity: 86 },
  { address: "2468 Birch Ln", price: "$515,000", date: "Dec 2025", sqft: "2,100", beds: 4, baths: 3, distance: "1.1 mi", similarity: 78 },
];

const TREND_BARS = [
  { label: "6 mo ago", value: "$451K", pct: 72 },
  { label: "5 mo ago", value: "$458K", pct: 75 },
  { label: "4 mo ago", value: "$462K", pct: 77 },
  { label: "3 mo ago", value: "$470K", pct: 80 },
  { label: "2 mo ago", value: "$475K", pct: 82 },
  { label: "Last mo", value: "$478K", pct: 84 },
  { label: "Current", value: "$485K", pct: 88 },
];

const FACTORS = [
  { label: "Living Area & Spatial Layout", pct: 32 },
  { label: "Comparable Settlement Density", pct: 28 },
  { label: "Neighborhood Appreciation Vector", pct: 18 },
  { label: "Overall Material & Finish Condition", pct: 14 },
  { label: "Lot Orientation & Site Factors", pct: 8 },
];

export default function SampleReport() {
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
            <span className="section-heading__label">Interactive Sample Report</span>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              Sample property dossier
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 540, margin: "0 auto" }}>
              Explore an authentic valuation report format generated from real residential market data.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Result Dossier */}
      <section className="section--sm">
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          <ScrollReveal>
            <div className="report-preview" style={{ marginBottom: "var(--space-10)" }}>
              <div className="report-preview__header" style={{ padding: "var(--space-10) var(--space-8)" }}>
                <div style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-accent)", fontWeight: 700, marginBottom: "var(--space-1)" }}>
                  Estimated Market Value
                </div>
                <div className="report-preview__price" style={{ fontSize: "clamp(2.5rem, 5.5vw, var(--text-6xl))" }}>
                  $485,000
                </div>
                <div className="report-preview__range" style={{ marginBottom: "var(--space-4)" }}>
                  Calibrated Range: $462,000 — $508,000
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <span className="badge badge--gold">Moderate Confidence</span>
                  <span className="badge badge--brand">Active Market Feed</span>
                  <span className="badge badge--success">94% Comp Similarity</span>
                </div>
              </div>

              <div className="report-preview__body">
                {/* Property Summary */}
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <h3 className="heading-5" style={{ marginBottom: "var(--space-4)" }}>Property Specifications</h3>
                  <div className="grid grid--4" style={{ gap: "var(--space-4)" }}>
                    {[
                      { label: "Living Area", value: "1,842 sq ft" },
                      { label: "Lot Size", value: "5,100 sq ft" },
                      { label: "Bedrooms", value: "3 Beds" },
                      { label: "Bathrooms", value: "1 Full, 1 Half" },
                      { label: "Year Built", value: "1910" },
                      { label: "Remodeled", value: "2006 (Updated)" },
                      { label: "Garage Capacity", value: "1 Car (216 sq ft)" },
                      { label: "Quality Grade", value: "8 / 10 Tier" },
                    ].map(({ label, value }) => (
                      <div key={label} className="glass-card" style={{ padding: "var(--space-4)" }}>
                        <div className="body-xs text-tertiary" style={{ marginBottom: "var(--space-1)" }}>{label}</div>
                        <div className="body-sm" style={{ fontWeight: 600 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* Estimate Explanation */}
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <h3 className="heading-5" style={{ marginBottom: "var(--space-5)" }}>Valuation Attribution Drivers</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    {FACTORS.map(({ label, pct }) => (
                      <div key={label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
                          <span className="body-sm" style={{ fontWeight: 500 }}>{label}</span>
                          <span className="body-sm text-accent" style={{ fontWeight: 600 }}>{pct}% Weight</span>
                        </div>
                        <div style={{
                          width: "100%", height: 8, backgroundColor: "var(--border-default)",
                          borderRadius: "var(--radius-full)", overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${pct * 2.8}%`, height: "100%",
                            background: pct > 20 ? "linear-gradient(90deg, var(--color-indigo-500), var(--color-gold-500))" : "var(--color-gold-500)",
                            borderRadius: "var(--radius-full)",
                            transition: "width 0.8s var(--ease-default)",
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="divider" />

                {/* Comparable Properties Table */}
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <h3 className="heading-5" style={{ marginBottom: "var(--space-5)" }}>Recent Comparable Sales</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-sm)" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid var(--border-default)" }}>
                          {["Address", "Sale Price", "Date", "Sq Ft", "Beds", "Baths", "Distance", "Match"].map((h) => (
                            <th key={h} style={{ padding: "var(--space-3) var(--space-4)", textAlign: "left", fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {COMPARABLES.map((c, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid var(--border-default)" }}>
                            <td style={{ padding: "var(--space-3) var(--space-4)", fontWeight: 600 }}>{c.address}</td>
                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>{c.price}</td>
                            <td style={{ padding: "var(--space-3) var(--space-4)", color: "var(--text-tertiary)" }}>{c.date}</td>
                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>{c.sqft}</td>
                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>{c.beds}</td>
                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>{c.baths}</td>
                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>{c.distance}</td>
                            <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                              <span className={`badge ${c.similarity >= 90 ? "badge--success" : "badge--warning"}`}>
                                {c.similarity}% Match
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="divider" />

                {/* Neighborhood Trends */}
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <h3 className="heading-5" style={{ marginBottom: "var(--space-5)" }}>Neighborhood Trend Velocity</h3>

                  <div className="grid grid--3" style={{ gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
                    <div className="stat-card">
                      <div className="stat-card__value">$478K</div>
                      <div className="stat-card__label">Neighborhood median</div>
                      <div className="stat-card__change stat-card__change--up">↑ 4.2% YoY</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-card__value">23 days</div>
                      <div className="stat-card__label">Average market velocity</div>
                      <div className="stat-card__change stat-card__change--down">↓ 8 days faster</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-card__value">47</div>
                      <div className="stat-card__label">Settled sales (6 mo)</div>
                      <div className="stat-card__change stat-card__change--up">↑ 12% Vol</div>
                    </div>
                  </div>

                  {/* Trend chart bar visualization */}
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-3)", height: 160 }}>
                    {TREND_BARS.map(({ label, value, pct }, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
                        <span className="body-xs text-tertiary" style={{ fontWeight: 600 }}>{value}</span>
                        <div style={{
                          width: "100%", height: `${pct}%`,
                          background: i === TREND_BARS.length - 1 ? "linear-gradient(180deg, var(--color-gold-400), var(--color-gold-600))" : "var(--badge-brand-bg)",
                          border: "1px solid var(--border-default)",
                          borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                          transition: "height 0.6s var(--ease-default)",
                          minHeight: 8,
                        }} />
                        <span className="body-xs text-tertiary" style={{ whiteSpace: "nowrap" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container container--narrow">
          <ScrollReveal>
            <h2 className="heading-3" style={{ marginBottom: "var(--space-4)" }}>Value your own residence</h2>
            <p className="body-lg text-secondary" style={{ marginBottom: "var(--space-8)" }}>
              Get custom insights calibrated specifically for your property in seconds.
            </p>
            <Link
              to="/estimate"
              className="btn btn--accent btn--lg"
            >
              <span>Start My Valuation</span>
              <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
