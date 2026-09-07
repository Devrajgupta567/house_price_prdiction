import { Link } from "react-router-dom";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How It Works", to: "/how-it-works" },
      { label: "Features", to: "/features" },
      { label: "Sample Report", to: "/sample-report" },
      { label: "Get Estimate", to: "/estimate" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Help Center", to: "/help" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Data Security", to: "/security" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              Valu<span className="footer__brand-accent">Al</span>tion
            </div>
            <p className="footer__tagline">
              Data-driven property valuations powered by machine learning,
              comparable sales analysis, and neighborhood market insights.
            </p>
          </div>
          {COLUMNS.map(({ heading, links }) => (
            <div key={heading}>
              <div className="footer__heading">{heading}</div>
              <div className="footer__links">
                {links.map(({ label, to }) => (
                  <Link key={to} to={to} className="footer__link">{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span className="footer__copyright">
            © {year} ValuAltion. All rights reserved.
          </span>
          <div className="footer__legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/security">Security</Link>
          </div>
        </div>
      </div>

      {/* Non-appraisal disclaimer */}
      <div className="disclaimer-bar" style={{ marginTop: "var(--space-8)", borderTopColor: "rgba(255,255,255,0.08)" }}>
        <p className="disclaimer-bar__text" style={{ color: "var(--color-gray-500)" }}>
          ValuAltion provides estimated property values based on available data and machine learning models.
          These estimates are not formal appraisals and should not be used as such. Actual property values
          may differ. Consult a licensed appraiser for an official valuation.
        </p>
      </div>
    </footer>
  );
}
