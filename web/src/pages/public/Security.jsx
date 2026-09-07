import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Server,
  Cpu,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

const SECURITY_PILLARS = [
  {
    icon: <Lock size={26} />,
    title: "Transport Layer Encryption (TLS 1.3)",
    desc: "Every interaction between your web browser and our API services is strictly encrypted using TLS 1.3 over HTTPS with robust cipher suites. Unencrypted HTTP traffic is systematically rejected.",
  },
  {
    icon: <KeyRound size={26} />,
    title: "Salted BCrypt Password Hashing",
    desc: "User credentials are never stored in plaintext. We utilize multi-round salted BCrypt one-way cryptographic hashing, ensuring your password cannot be reversed or intercepted.",
  },
  {
    icon: <FileCheck size={26} />,
    title: "Stateless JWT & Session Governance",
    desc: "Authentication sessions utilize digitally signed JSON Web Tokens (JWT) verified cryptographically on every request. Tokens enforce strict expiration bounds and role claims.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Role-Based Access Control (RBAC)",
    desc: "Our Spring Boot architecture employs method-level role authorization (@PreAuthorize). Regular homeowners cannot access administrator diagnostics, user tables, or model logs under any circumstance.",
  },
  {
    icon: <Cpu size={26} />,
    title: "Microservice Pipeline Isolation",
    desc: "The machine learning prediction service runs in an isolated Python FastAPI environment separate from user authentication databases. Model training artifacts are tracked deterministically.",
  },
  {
    icon: <Server size={26} />,
    title: "OTP Multi-Factor Verification",
    desc: "High-risk workflows—including new homeowner registrations and password reset attempts—require verification against dynamic 6-digit one-time codes delivered via secure email channels.",
  },
];

export default function Security() {
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
            <div className="badge badge--brand" style={{ marginBottom: "var(--space-3)" }}>
              <ShieldCheck size={13} />
              <span>Trust &amp; Infrastructure</span>
            </div>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              Enterprise Data Security
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 580, margin: "0 auto" }}>
              How ValuAltion defends homeowner information, financial portfolio data, and predictive machine learning models.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Security Architecture Pillars ──────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">Defense in Depth</span>
            <h2 className="section-heading__title">
              Engineered with rigorous security at every layer
            </h2>
            <p className="section-heading__subtitle">
              We employ military-grade encryption and zero-trust principles across all frontend, backend, and machine learning components.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
            {SECURITY_PILLARS.map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 60}>
                <div className="glass-card feature-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className="feature-card__icon" style={{ color: "var(--color-gold-500)" }}>
                    {item.icon}
                  </div>
                  <h3 className="feature-card__title" style={{ fontSize: "var(--text-xl)" }}>
                    {item.title}
                  </h3>
                  <p className="feature-card__text">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Best Practices for Users ───────────────────────── */}
      <section className="section--sm" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          <div className="glass-card" style={{ padding: "var(--space-10)", borderRadius: "var(--radius-2xl)" }}>
            <h3 className="heading-3" style={{ marginBottom: "var(--space-4)", textAlign: "center" }}>
              User Security Recommendations
            </h3>
            <p className="body-base text-secondary" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto var(--space-8)" }}>
              While our backend implements stringent safeguards, you can enhance your account defense with simple habits:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-5)" }}>
              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                <CheckCircle2 size={20} style={{ color: "var(--color-emerald-500)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 className="heading-6" style={{ margin: "0 0 2px 0" }}>Unique Strong Passwords</h4>
                  <p className="body-xs text-secondary" style={{ margin: 0 }}>
                    Use a minimum of 8 characters including uppercase, numbers, and special symbols that you don't reuse on other platforms.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                <CheckCircle2 size={20} style={{ color: "var(--color-emerald-500)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 className="heading-6" style={{ margin: "0 0 2px 0" }}>Protect Your Email Inbox</h4>
                  <p className="body-xs text-secondary" style={{ margin: 0 }}>
                    Because OTP verification codes are delivered to your email, ensure your email provider utilizes 2FA authentication.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                <CheckCircle2 size={20} style={{ color: "var(--color-emerald-500)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 className="heading-6" style={{ margin: "0 0 2px 0" }}>Sign Out On Shared Terminals</h4>
                  <p className="body-xs text-secondary" style={{ margin: 0 }}>
                    Always click 'Sign Out' when accessing your ValuAltion portfolio from public or shared workstation browsers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vulnerability Disclosure Section ────────────────────────── */}
      <section className="section">
        <div className="container container--narrow">
          <div
            className="glass-card"
            style={{
              padding: "var(--space-8)",
              borderRadius: "var(--radius-2xl)",
              border: "1px solid rgba(197, 165, 90, 0.4)",
              background: "linear-gradient(135deg, rgba(197, 165, 90, 0.12), rgba(26, 26, 46, 0.85))",
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-5)", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "var(--radius-xl)",
                  background: "rgba(197, 165, 90, 0.2)",
                  color: "var(--color-gold-500)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={26} />
              </div>
              <div>
                <h3 className="heading-4" style={{ margin: "0 0 var(--space-2) 0" }}>
                  Responsible Security Disclosure
                </h3>
                <p className="body-sm text-secondary" style={{ margin: "0 0 var(--space-4) 0", lineHeight: 1.6 }}>
                  If you are a security researcher and believe you have identified a vulnerability or flaw within the ValuAltion platform, please notify our team privately. We will evaluate and remediate confirmed vulnerabilities promptly.
                </p>
                <a
                  href="mailto:getvalaltion@gmail.com?subject=Security%20Vulnerability%20Disclosure"
                  className="btn btn--accent btn--sm"
                  style={{ display: "inline-flex", gap: "6px" }}
                >
                  <span>Submit Security Report</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
