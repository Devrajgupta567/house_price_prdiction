import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Building,
  ShieldCheck,
  MessageSquare
} from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "valuation",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please complete all required fields before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

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
            <span className="section-heading__label">Direct Inquiries &amp; Support</span>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              Get in touch with our team
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 540, margin: "0 auto" }}>
              Have questions about your property valuation, enterprise API access, or data privacy? We're here to help.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main Content Grid ──────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ maxWidth: "var(--container-xl)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-10)", alignItems: "start" }}>
            
            {/* Left Column: Direct Info Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <div>
                <h2 className="heading-3" style={{ marginBottom: "var(--space-2)" }}>
                  Connect with ValuAltion
                </h2>
                <p className="body-base text-secondary" style={{ marginBottom: "var(--space-6)" }}>
                  Our research and engineering personnel are dedicated to delivering prompt, accurate support to homeowners and platform partners.
                </p>
              </div>

              {/* Email Card */}
              <div className="glass-card" style={{ padding: "var(--space-6)", display: "flex", gap: "var(--space-4)", borderRadius: "var(--radius-xl)" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-lg)",
                    background: "rgba(197, 165, 90, 0.15)",
                    color: "var(--color-gold-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="heading-5" style={{ margin: "0 0 4px 0" }}>Direct Email Support</h3>
                  <a
                    href="mailto:getvalaltion@gmail.com"
                    style={{ color: "var(--color-gold-500)", fontWeight: 600, fontSize: "var(--text-base)" }}
                  >
                    getvalaltion@gmail.com
                  </a>
                  <p className="body-xs text-tertiary" style={{ margin: "4px 0 0" }}>
                    Average response time: under 24 business hours.
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="glass-card" style={{ padding: "var(--space-6)", display: "flex", gap: "var(--space-4)", borderRadius: "var(--radius-xl)" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-lg)",
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "var(--color-indigo-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="heading-5" style={{ margin: "0 0 4px 0" }}>Research &amp; Modeling Hub</h3>
                  <p className="body-sm text-primary" style={{ margin: 0, fontWeight: 500 }}>
                    Ames Residential Market Intelligence Center
                  </p>
                  <p className="body-xs text-secondary" style={{ margin: "2px 0 0" }}>
                    Ames, Iowa 50010, United States
                  </p>
                </div>
              </div>

              {/* Hours & Help Center Card */}
              <div className="glass-card" style={{ padding: "var(--space-6)", display: "flex", gap: "var(--space-4)", borderRadius: "var(--radius-xl)" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-lg)",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "var(--color-emerald-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="heading-5" style={{ margin: "0 0 4px 0" }}>Operating Hours</h3>
                  <p className="body-sm text-secondary" style={{ margin: 0 }}>
                    Monday – Friday: 8:00 AM – 6:00 PM CST
                  </p>
                  <p className="body-xs text-tertiary" style={{ margin: "4px 0 0" }}>
                    Looking for instant answers? Visit our{" "}
                    <Link to="/help" style={{ color: "var(--color-gold-500)", textDecoration: "underline" }}>
                      Help Center &amp; FAQ
                    </Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="glass-card" style={{ padding: "var(--space-8)", borderRadius: "var(--radius-2xl)" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "var(--space-8) 0" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "var(--color-emerald-500)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto var(--space-4)",
                      border: "2px solid rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    <CheckCircle size={36} />
                  </div>
                  <h3 className="heading-3" style={{ marginBottom: "var(--space-2)" }}>
                    Message Received
                  </h3>
                  <p className="body-base text-secondary" style={{ maxWidth: 420, margin: "0 auto var(--space-6)" }}>
                    Thank you for contacting ValuAltion. Our analytics desk has received your inquiry and will follow up with you at{" "}
                    <strong style={{ color: "var(--text-primary)" }}>{form.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", subject: "valuation", message: "" });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: "var(--space-6)" }}>
                    <h3 className="heading-3" style={{ margin: 0 }}>Send Us a Message</h3>
                    <p className="body-sm text-secondary" style={{ margin: "4px 0 0" }}>
                      Fill out the form below and an analyst will reply within 24 hours.
                    </p>
                  </div>

                  {error && (
                    <div className="auth-error" style={{ marginBottom: "var(--space-6)" }}>
                      <AlertCircle size={16} /> <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                      
                      <div className="profile-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="contact-name">Your Full Name *</label>
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            className="form-input"
                            placeholder="e.g. Alex Henderson"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="contact-email">Email Address *</label>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-subject">Inquiry Classification</label>
                        <select
                          id="contact-subject"
                          name="subject"
                          className="form-input form-select"
                          value={form.subject}
                          onChange={handleChange}
                        >
                          <option value="valuation">Valuation Methodology &amp; Data Verification</option>
                          <option value="account">Account, OTP or Login Assistance</option>
                          <option value="enterprise">Enterprise API &amp; Portfolio Analytics</option>
                          <option value="report">Valuation Dossier &amp; PDF Questions</option>
                          <option value="feedback">General Feedback &amp; Feature Requests</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="contact-message">Your Message *</label>
                        <textarea
                          id="contact-message"
                          name="message"
                          className="form-input"
                          rows={5}
                          placeholder="Describe your question, property details, or partnership opportunity in detail…"
                          value={form.message}
                          onChange={handleChange}
                          style={{ resize: "vertical" }}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn--accent btn--lg btn--full"
                        disabled={loading}
                        style={{ marginTop: "var(--space-2)", gap: "8px" }}
                      >
                        {loading ? (
                          <span className="btn-loading-spinner" />
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Transmit Inquiry</span>
                          </>
                        )}
                      </button>

                      <p className="body-xs text-tertiary" style={{ textAlign: "center", margin: "var(--space-2) 0 0" }}>
                        We respect your privacy. Inquiries are handled in accordance with our{" "}
                        <Link to="/privacy" style={{ color: "var(--color-gold-500)", textDecoration: "underline" }}>
                          Privacy Policy
                        </Link>.
                      </p>

                    </div>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
