import { Link } from "react-router-dom";

export default function Logo({ size = "default", withText = true, className = "" }) {
  const isLarge = size === "large";
  const iconSize = isLarge ? 38 : 28;

  return (
    <Link to="/" className={`brand-logo-link ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
      <div
        className="brand-logo-icon-wrapper"
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: "8px",
          background: "linear-gradient(135deg, rgba(197, 165, 90, 0.25) 0%, rgba(26, 26, 46, 0.8) 100%)",
          border: "1px solid rgba(197, 165, 90, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 16px rgba(197, 165, 90, 0.2)",
          flexShrink: 0,
        }}
      >
        <svg
          width={iconSize - 8}
          height={iconSize - 8}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Diamond apex */}
          <polygon
            points="12,2 17,8 12,12 7,8"
            fill="url(#goldGradient)"
            stroke="#e2c275"
            strokeWidth="0.75"
          />
          {/* House roofline & frame */}
          <path
            d="M3 11L12 3.5L21 11V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V11Z"
            stroke="url(#goldGradient)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner arch doorway */}
          <path
            d="M9 21V13C9 12.4477 9.44772 12 10 12H14C14.5523 12 15 12.4477 15 13V21"
            stroke="#e2c275"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* AI Node sparks */}
          <circle cx="5" cy="11" r="1" fill="#e2c275" />
          <circle cx="19" cy="11" r="1" fill="#e2c275" />
          <defs>
            <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f3e09d" />
              <stop offset="50%" stopColor="#c5a55a" />
              <stop offset="100%" stopColor="#8d6e27" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {withText && (
        <span
          className="brand-logo-text"
          style={{
            fontSize: isLarge ? "1.5rem" : "1.2rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading, inherit)",
            display: "inline-flex",
            alignItems: "baseline",
            transition: "color 0.2s ease",
          }}
        >
          Valu<span style={{ color: "var(--text-accent, #c5a55a)" }}>Al</span>tion
        </span>
      )}
    </Link>
  );
}
