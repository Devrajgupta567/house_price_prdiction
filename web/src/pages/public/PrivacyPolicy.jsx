import { Link } from "react-router-dom";
import { Shield, Lock, EyeOff, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

export default function PrivacyPolicy() {
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
            <span className="section-heading__label">Legal &amp; Trust</span>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              Privacy Policy
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 580, margin: "0 auto var(--space-3)" }}>
              Your trust is the foundation of our platform. Learn how ValuAltion collects, secures, and handles your personal and residential data.
            </p>
            <span className="body-xs text-tertiary">
              Last Updated &amp; Effective: {lastUpdated}
            </span>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main Legal Text ────────────────────────────────────────── */}
      <section className="section">
        <div className="container container--narrow">
          <div className="glass-card" style={{ padding: "var(--space-10)", borderRadius: "var(--radius-2xl)" }}>
            
            {/* Highlights Box */}
            <div
              style={{
                background: "rgba(197, 165, 90, 0.1)",
                border: "1px solid rgba(197, 165, 90, 0.3)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--space-6)",
                marginBottom: "var(--space-8)",
              }}
            >
              <h3 className="heading-5" style={{ color: "var(--color-gold-500)", marginBottom: "var(--space-3)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={20} />
                <span>Our Core Privacy Commitments</span>
              </h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "8px", margin: 0, paddingLeft: "1.2rem", listStyleType: "disc" }}>
                <li className="body-sm text-secondary">
                  <strong>Zero Data Brokering:</strong> We will never sell, rent, or trade your personal property searches or account details to third-party mortgage lenders, lead aggregators, or brokers.
                </li>
                <li className="body-sm text-secondary">
                  <strong>Encrypted Storage:</strong> All passwords are encrypted using multi-round salted BCrypt, and network communications are strictly enforced via TLS 1.3.
                </li>
                <li className="body-sm text-secondary">
                  <strong>Account Autonomy:</strong> You retain complete ownership of your saved valuations and may request complete data erasure at any time.
                </li>
              </ul>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", lineHeight: 1.7 }}>
              
              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>1. Information We Collect</h2>
                <p className="body-base text-secondary" style={{ marginBottom: "var(--space-3)" }}>
                  When you access or register on the ValuAltion platform, we collect information necessary to compute calibrated property estimates, authenticate user sessions, and maintain your valuation history:
                </p>
                <ul style={{ paddingLeft: "1.5rem", listStyleType: "circle", display: "flex", flexDirection: "column", gap: "6px" }} className="body-sm text-secondary">
                  <li><strong>Account Credentials:</strong> Full name, verified email address, phone number, and hashed password credentials.</li>
                  <li><strong>Property Input Specifications:</strong> Square footage, year built, bedrooms, bathrooms, basement area, garage capacity, neighborhood, and build quality/condition selections.</li>
                  <li><strong>Session &amp; Security Data:</strong> IP addresses, browser client user-agents, authentication timestamps, and temporary OTP verification tokens.</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>2. How We Utilize Valuation Data</h2>
                <p className="body-base text-secondary" style={{ marginBottom: "var(--space-3)" }}>
                  We utilize collected inputs strictly to:
                </p>
                <ul style={{ paddingLeft: "1.5rem", listStyleType: "circle", display: "flex", flexDirection: "column", gap: "6px" }} className="body-sm text-secondary">
                  <li>Compute predictive valuation algorithms and evaluate nearest-neighbor comparable market transactions.</li>
                  <li>Maintain and render your personal valuation portfolio history in the Profile Dashboard.</li>
                  <li>Generate downloadable client-side PDF appraisal reports for your private documentation.</li>
                  <li>Monitor server uptime, investigate malicious security attacks, and enforce role-based access control.</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>3. Information Sharing &amp; Third Parties</h2>
                <p className="body-base text-secondary">
                  ValuAltion does not share your personally identifiable information with external commercial entities. Information is only disclosed under the following narrow circumstances:
                </p>
                <ul style={{ paddingLeft: "1.5rem", listStyleType: "circle", display: "flex", flexDirection: "column", gap: "6px", marginTop: "var(--space-2)" }} className="body-sm text-secondary">
                  <li><strong>Service Infrastructure:</strong> Secure cloud infrastructure providers who host our containerized services under strict non-disclosure obligations.</li>
                  <li><strong>Legal Compliance:</strong> When strictly required by statutory subpoena, court order, or applicable federal/state jurisprudence.</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>4. Data Security &amp; Encryption Standards</h2>
                <p className="body-base text-secondary">
                  We employ defense-in-depth security architectures to protect user data. All API endpoints transmit across HTTPS with modern cipher suites. Authentication utilizes cryptographically signed JSON Web Tokens (JWT) with defined expiration windows, and one-time password (OTP) verification safeguards sensitive workflows such as user onboarding and password resets.
                </p>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>5. User Rights (GDPR &amp; CCPA)</h2>
                <p className="body-base text-secondary">
                  Regardless of your jurisdiction, ValuAltion honors fundamental privacy rights:
                </p>
                <ul style={{ paddingLeft: "1.5rem", listStyleType: "circle", display: "flex", flexDirection: "column", gap: "6px", marginTop: "var(--space-2)" }} className="body-sm text-secondary">
                  <li><strong>Right to Access:</strong> You may view all stored property records and account details at any time directly in your Profile Dashboard.</li>
                  <li><strong>Right to Rectification:</strong> You can edit personal information, contact numbers, and saved notes via the Edit Profile interface.</li>
                  <li><strong>Right to Erasure:</strong> You may submit an account deletion request to purge all associated records permanently from our database.</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-4" style={{ marginBottom: "var(--space-3)" }}>6. Inquiries &amp; Data Protection Officer</h2>
                <p className="body-base text-secondary">
                  For privacy-related inquiries, data export requests, or security disclosures, contact our privacy desk directly at{" "}
                  <a href="mailto:getvalaltion@gmail.com" style={{ color: "var(--color-gold-500)", fontWeight: 600 }}>
                    getvalaltion@gmail.com
                  </a>.
                </p>
              </div>

            </div>

            <div style={{ marginTop: "var(--space-10)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--border-default)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <span className="body-sm text-tertiary">
                Have questions regarding our terms or disclosures?
              </span>
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Link to="/terms" className="btn btn--secondary btn--sm">
                  View Terms of Service
                </Link>
                <Link to="/contact" className="btn btn--accent btn--sm">
                  Contact Support
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
