import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  HelpCircle,
  Calculator,
  Shield,
  FileText,
  Home,
  MessageCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Accordion from "../../components/Accordion";
import ScrollReveal from "../../components/ScrollReveal";

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "valuation", label: "Valuation & ML Accuracy" },
  { id: "inputs", label: "Property Specs & Features" },
  { id: "account", label: "Accounts & Security" },
  { id: "reports", label: "Reports & Exports" },
];

const ALL_FAQS = [
  {
    category: "valuation",
    question: "How does the ValuAltion algorithm calculate my home value?",
    answer: "Our machine learning engine runs an ensemble of gradient-boosted decision regression trees trained on thousands of verified residential transactions in the Ames submarket. It accounts for over 15 primary valuation drivers—including above-ground square footage, basement area, build quality rating, structural condition, bedrooms, bathrooms, year built, and neighborhood appreciation vectors.",
  },
  {
    category: "valuation",
    question: "How accurate is the estimated value and confidence score?",
    answer: "Our model achieves an average calibrated accuracy of 85.6% across diverse housing archetypes. Every valuation includes a dynamic confidence score (e.g., 94% High Accuracy) and a calibrated valuation range (conservative to optimistic). Homes with common architectural characteristics and recent comparable sales receive higher confidence ratings.",
  },
  {
    category: "valuation",
    question: "Is ValuAltion considered an official appraisal?",
    answer: "No. ValuAltion provides an automated valuation model (AVM) estimate designed as an informative financial benchmark and portfolio tracking tool for homeowners and real estate investors. For official mortgage lending, tax appeals, or legal transactions, lenders will require an appraisal performed by a state-certified real estate appraiser.",
  },
  {
    category: "inputs",
    question: "What is the difference between Build Quality and Overall Condition?",
    answer: "Build Quality (1–10) measures the grade of materials, architectural design, craftsmanship, and structural finishes originally built into the property (e.g., 8–10 represents custom high-end architectural craftsmanship). Overall Condition (1–10) reflects maintenance, wear-and-tear, and physical upkeep regardless of original construction luxury.",
  },
  {
    category: "inputs",
    question: "How does Central Air (A/C) affect property valuation?",
    answer: "In Midwestern housing markets like Ames, central air conditioning has a statistically significant positive price elasticity. On average, homes with certified central air trade at a 3.5% premium compared to similar homes reliant on evaporative cooling or window units.",
  },
  {
    category: "inputs",
    question: "Can I enter a home with unfinished basement space?",
    answer: "Yes. Enter the total basement square footage in the Basement Area field. The model evaluates finished versus raw basement ratios based on the year built and neighborhood development standards.",
  },
  {
    category: "account",
    question: "Why do you require OTP email verification during registration and password resets?",
    answer: "We implement one-time password (OTP) verification codes sent to your email to prevent credential stuffing, bot spamming, and unauthorized account access. This ensures only verified homeowners and registered users can save valuation dossiers to their portfolio.",
  },
  {
    category: "account",
    question: "What should I do if I forgot my account password?",
    answer: "Navigate to the Sign In page and click 'Forgot password?' (or visit /forgot-password). Enter your registered email address to receive a secure 6-digit verification code. Once verified, you can instantly set a new password and log back into your dashboard.",
  },
  {
    category: "account",
    question: "How can I update my profile details or primary address?",
    answer: "Log into your account, click on your name or 'Dashboard & Profile' in the top navbar, and navigate to the 'Edit Profile' tab. You can update your contact information, registered street address, occupation, and bio at any time.",
  },
  {
    category: "reports",
    question: "Can I download a PDF copy of my valuation dossier?",
    answer: "Yes. Immediately after running an estimate on the Results page, or at any time from your Valuation History in the Profile Dashboard, click 'Download PDF Report'. Our client-side PDF synthesizer generates a clean, bank-ready dossier with comps, ranges, and confidence metrics.",
  },
  {
    category: "reports",
    question: "Where are my past property estimates saved?",
    answer: "Every valuation generated while logged in is automatically stored in your personal Valuation History on the Profile Dashboard. You can revisit past estimates, track changes over time, and redownload dossiers whenever needed.",
  },
  {
    category: "reports",
    question: "Are my property estimates shared publicly with real estate brokers?",
    answer: "No. ValuAltion does not sell, license, or broker your personal property searches or saved portfolio records to third-party real estate brokerages, mortgage lenders, or telemarketers. Your portfolio remains completely private.",
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCat = activeCategory === "all" || faq.category === activeCategory;
      const qText = faq.question.toLowerCase();
      const aText = faq.answer.toLowerCase();
      const s = search.toLowerCase().trim();
      const matchesSearch = !s || qText.includes(s) || aText.includes(s);
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <>
      {/* ── Hero Search Section ────────────────────────────────────── */}
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
            <span className="section-heading__label">Knowledge Base</span>
            <h1 className="heading-1" style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              How can we help you?
            </h1>
            <p className="body-lg text-secondary" style={{ maxWidth: 540, margin: "0 auto var(--space-8)" }}>
              Explore answers to frequently asked questions about our AI valuation methodology, accuracy scores, account management, and reports.
            </p>

            {/* Search Bar */}
            <div style={{ position: "relative", maxWidth: 560, margin: "0 auto" }}>
              <Search
                size={20}
                style={{
                  position: "absolute",
                  left: "var(--space-4)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-tertiary)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search questions (e.g. accuracy, appraisal, central air, password)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  paddingLeft: "calc(var(--space-4) + 28px)",
                  paddingRight: "var(--space-4)",
                  height: "52px",
                  fontSize: "var(--text-base)",
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-md)",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: "var(--space-4)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-tertiary)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main FAQ Section ───────────────────────────────────────── */}
      <section className="section">
        <div className="container" style={{ maxWidth: "var(--container-lg)" }}>
          
          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              gap: "var(--space-2)",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "var(--space-10)",
            }}
          >
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`btn btn--sm ${activeCategory === cat.id ? "btn--primary" : "btn--secondary"}`}
                style={{
                  borderRadius: "var(--radius-full)",
                  padding: "var(--space-2) var(--space-4)",
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                }}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="glass-card" style={{ padding: "var(--space-12)", textAlign: "center", borderRadius: "var(--radius-2xl)" }}>
              <HelpCircle size={48} style={{ color: "var(--text-tertiary)", margin: "0 auto var(--space-4)" }} />
              <h3 className="heading-3" style={{ marginBottom: "var(--space-2)" }}>No Questions Found</h3>
              <p className="body-base text-secondary" style={{ maxWidth: 440, margin: "0 auto var(--space-6)" }}>
                We couldn't find any articles matching "{search}". Try searching for another topic or contact our support team.
              </p>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => { setSearch(""); setActiveCategory("all"); }}
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <Accordion items={filteredFaqs} />
            </div>
          )}

          {/* Bottom Help Banner */}
          <div
            className="glass-card"
            style={{
              marginTop: "var(--space-16)",
              padding: "var(--space-8)",
              borderRadius: "var(--radius-2xl)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-6)",
              flexWrap: "wrap",
              background: "linear-gradient(135deg, rgba(197, 165, 90, 0.12), rgba(26, 26, 46, 0.85))",
              border: "1px solid rgba(197, 165, 90, 0.35)",
            }}
          >
            <div>
              <div className="badge badge--brand" style={{ marginBottom: "var(--space-2)" }}>
                <MessageCircle size={13} />
                <span>Personalized Support</span>
              </div>
              <h3 className="heading-3" style={{ margin: 0 }}>Still have questions?</h3>
              <p className="body-sm text-secondary" style={{ margin: "4px 0 0" }}>
                Our engineering and research team can assist with specific property inquiries or model explanations.
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Link to="/contact" className="btn btn--accent btn--lg">
                <span>Contact Support</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
