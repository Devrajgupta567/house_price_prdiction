import { Link } from "react-router-dom";
import { AlertCircle, Scale, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

export default function TermsOfService() {
  const lastUpdated = "September 7, 2026";

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "calc(var(--navbar-height) + var(--space-16))",
          paddingBottom: "var(--space-12)",
          background: "var(--bg-hero)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <span className="section-heading__label">Platform Agreement</span>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              Terms of Service
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 580, margin: "0 auto var(--space-3)" }}>
              Please review these terms carefully. By accessing or using ValuAltion, you agree to be bound by the conditions described below.
            </p>
            <span className="body-xs text-tertiary">
              Effective Date: {lastUpdated}
            </span>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main Legal Text ────────────────────────────────────────── */}
      <section className="section">
        <div className="container container--narrow">
          <div className="glass-card" style={{ padding: "var(--space-10)", borderRadius: "var(--radius-2xl)" }}>
            
            {/* Mandatory AVM Appraisal Disclaimer Box */}
            <div
              style={{
                background: "rgba(245, 158, 11, 0.12)",
                border: "1.5px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-6)",
                marginBottom: "var(--space-8)",
              }}
            >
              <h3 className="heading-5" style={{ color: "var(--color-gold-500)", marginBottom: "var(--space-2)", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={22} />
                <span>Important Valuation &amp; Appraisal Notice</span>
              </h3>
              <p className="body-sm text-secondary" style={{ margin: 0, lineHeight: 1.6 }}>
                ValuAltion is an automated valuation model (AVM) and analytical financial decision-support tool. It is <strong>not an official appraisal</strong> performed in accordance with the Uniform Standards of Professional Appraisal Practice (USPAP) or state licensing authorities. Results should not be used as the exclusive basis for underwriting primary mortgages, legal foreclosure proceedings, or formal tax appeals without consulting a certified real estate appraiser.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", lineHeight: 1.7 }}>
              
              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>1. Acceptance of Terms</h2>
                <p className="body-base text-secondary">
                  By creating an account, running property valuations, or downloading valuation reports from ValuAltion ("we", "us", or "our"), you signify your agreement to these Terms of Service. If you do not accept these terms in their entirety, you must discontinue using our services immediately.
                </p>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>2. Permitted Use &amp; Account Obligations</h2>
                <p className="body-base text-secondary" style={{ marginBottom: "var(--space-3)" }}>
                  You agree to use ValuAltion strictly for lawful residential property research and personal portfolio tracking. You agree not to:
                </p>
                <ul style={{ paddingLeft: "1.5rem", listStyleType: "circle", display: "flex", flexDirection: "column", gap: "6px" }} className="body-sm text-secondary">
                  <li>Deploy automated scrapers, web spiders, or crawlers to extract dataset comps or algorithm weights without written authorization.</li>
                  <li>Circumvent API rate limits, authentication barriers, or security protocols protecting user accounts or administrator endpoints.</li>
                  <li>Register accounts utilizing fraudulent email addresses or unauthorized third-party credentials.</li>
                  <li>Reverse engineer, decompile, or extract model weights from our machine learning pipeline.</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>3. Intellectual Property &amp; Valuation Reports</h2>
                <p className="body-base text-secondary">
                  All software code, predictive modeling architectures, visual interface designs, and brand marks are the exclusive intellectual property of ValuAltion. You are granted a limited, revocable, non-exclusive license to view, save, and print PDF valuation dossiers for your personal property records or client advisory presentations.
                </p>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>4. Disclaimer of Warranties</h2>
                <p className="body-base text-secondary">
                  Our services, model predictions, confidence spreads, and market comps are provided on an <strong>"as-is"</strong> and <strong>"as-available"</strong> basis. While our machine learning models strive for maximal statistical precision, real estate market conditions fluctuate dynamically based on macroeconomic interest rates, unrecorded property defects, and individual negotiation outcomes. We expressly disclaim all warranties, whether express or implied.
                </p>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>5. Limitation of Liability</h2>
                <p className="body-base text-secondary">
                  In no event shall ValuAltion, its officers, developers, or research contributors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your reliance on property estimates, contract decisions, or investment transactions conducted based on platform outputs.
                </p>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>6. Governing Law &amp; Jurisdiction</h2>
                <p className="body-base text-secondary">
                  These terms shall be governed by and construed in accordance with the laws of the State of Iowa, United States, without regard to its conflict of law principles. Any dispute arising hereunder shall be subject to the exclusive jurisdiction of the state and federal courts located in Iowa.
                </p>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>7. Modifications &amp; Inquiries</h2>
                <p className="body-base text-secondary">
                  We reserve the right to modify these terms periodically. Continued use of the platform after revised terms are published constitutes your acceptance of the amendments. For inquiries regarding our terms, contact{" "}
                  <a href="mailto:getvalaltion@gmail.com" style={{ color: "var(--color-gold-500)", fontWeight: 600 }}>
                    getvalaltion@gmail.com
                  </a>.
                </p>
              </div>

            </div>

            <div style={{ marginTop: "var(--space-10)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <span className="body-sm text-tertiary">
                Need to understand how your data is protected?
              </span>
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Link to="/privacy" className="btn btn--secondary btn--sm">
                  Privacy Policy
                </Link>
                <Link to="/security" className="btn btn--accent btn--sm">
                  Data Security Standards
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
