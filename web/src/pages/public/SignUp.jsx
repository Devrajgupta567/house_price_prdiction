import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle,
  Shield, ArrowRight, KeyRound, RotateCcw, Phone, Briefcase,
  MapPin, Image, ChevronDown, FileText, Home
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* ── OTP 6-digit input ─────────────────────────────────────────────────── */
function OtpInput({ value, onChange }) {
  const digits = (value + "      ").slice(0, 6).split("");

  const focus = (idx) => document.getElementById(`otp-${idx}`)?.focus();

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      const next = [...digits]; next[idx] = " ";
      onChange(next.join("").trimEnd());
      if (idx > 0) focus(idx - 1);
      e.preventDefault();
    } else if (/^\d$/.test(e.key)) {
      const next = [...digits]; next[idx] = e.key;
      onChange(next.join("").trimEnd());
      if (idx < 5) focus(idx + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(p);
    focus(Math.min(p.length, 5));
    e.preventDefault();
  };

  return (
    <div className="otp-input-row">
      {digits.map((d, idx) => (
        <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric"
          maxLength={1} value={d.trim()} onKeyDown={(e) => handleKey(e, idx)}
          onPaste={handlePaste} onChange={() => {}}
          className={`otp-digit ${d.trim() ? "otp-digit--filled" : ""}`}
          autoFocus={idx === 0 && value.length === 0}
        />
      ))}
    </div>
  );
}

/* ── Password strength ─────────────────────────────────────────────────── */
const pwChecks = (pw) => [
  { label: "At least 8 characters", met: pw.length >= 8 },
  { label: "One uppercase letter",  met: /[A-Z]/.test(pw) },
  { label: "One number",            met: /\d/.test(pw) },
];

/* ── Step indicator ────────────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Your Info"     },
  { n: 2, label: "Verify Email"  },
  { n: 3, label: "Set Password"  },
  { n: 4, label: "Your Profile"  },
];

function StepBar({ current }) {
  return (
    <div className="signup-stepbar">
      {STEPS.map(({ n, label }, i) => (
        <div key={n} className="signup-stepbar__item">
          <div className={`signup-stepbar__dot
            ${current > n ? "signup-stepbar__dot--done" : ""}
            ${current === n ? "signup-stepbar__dot--active" : ""}`}>
            {current > n ? <CheckCircle size={14} /> : n}
          </div>
          <span className={`signup-stepbar__label body-xs
            ${current >= n ? "text-primary" : "text-tertiary"}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className={`signup-stepbar__connector
              ${current > n ? "signup-stepbar__connector--done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function SignUp() {
  const navigate = useNavigate();
  const { initiateSignup, verifyOtp, completeProfile } = useAuth();

  const [step, setStep]       = useState(1);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 data
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");

  // Step 2 data
  const [otp, setOtp]               = useState("");
  const [cooldown, setCooldown]     = useState(0);
  const [resending, setResending]   = useState(false);

  // Step 3 data
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const checks     = pwChecks(password);
  const pwValid    = checks.every((c) => c.met);

  // Step 4 data
  const [profile, setProfile] = useState({
    phoneNumber: "", age: "", gender: "",
    occupation: "", bio: "", profilePictureUrl: "",
    addressLine: "", city: "", stateProvince: "",
    zipCode: "", country: "United States",
  });

  const err = (msg) => { setError(msg); setLoading(false); };
  const clear = () => setError("");

  /* OTP cooldown ticker */
  const startCooldown = (s) => {
    setCooldown(s);
    const t = setInterval(() => setCooldown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
  };

  /* ── Step 1: Send OTP ─────────────────────────────────────────────── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return err("Please enter your name and email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err("Please enter a valid email address.");
    setLoading(true); clear();
    try {
      await initiateSignup(name.trim(), email.trim());
      setStep(2); startCooldown(60);
    } catch (ex) { err(ex.message || "Failed to send OTP. Please try again."); }
    finally { setLoading(false); }
  };

  /* ── Step 2: Verify OTP ───────────────────────────────────────────── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.replace(/\s/g, "");
    if (code.length < 6) return err("Please enter all 6 digits.");
    setLoading(true); clear();
    try {
      await verifyOtp(email, code);
      setStep(3);
    } catch (ex) { err(ex.message || "Invalid OTP. Please try again."); setOtp(""); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true); clear();
    try {
      await fetch("/api/v1/auth/resend-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setOtp(""); startCooldown(60);
    } catch { setError("Failed to resend. Please try again."); }
    finally { setResending(false); }
  };

  /* ── Step 3: Set password, go to profile ─────────────────────────── */
  const handleSetPassword = (e) => {
    e.preventDefault();
    if (!pwValid) return err("Please meet all password requirements.");
    clear(); setStep(4);
  };

  /* ── Step 4: Complete profile → issue JWT → redirect ─────────────── */
  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    setLoading(true); clear();
    try {
      const payload = {
        email,
        password,
        ...profile,
        age: profile.age ? Number(profile.age) : null,
      };
      // Remove empty strings so backend gets nulls
      Object.keys(payload).forEach(k => { if (payload[k] === "") payload[k] = null; });
      await completeProfile(payload);
      navigate("/estimate");
    } catch (ex) { err(ex.message || "Registration failed. Please try again."); }
    finally { setLoading(false); }
  };

  const profileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  /* ── Branding sidebar copy ────────────────────────────────────────── */
  const sidebarContent = {
    1: { title: "Join ValuAltion", sub: "Start with just your name and email. We'll verify it's really you.", features: ["🏠 AI property valuations", "📊 Market comparables", "🔐 OTP email security", "💡 Trained on 10,000+ sales"] },
    2: { title: "Check Your Email", sub: `We just sent a 6-digit code to ${email || "your email"}.`, features: ["✉️ Code expires in 10 minutes", "🔄 Resend if it doesn't arrive", "📋 Check console if testing locally", "🔒 Keeps your account secure"] },
    3: { title: "Secure Your Account", sub: "Choose a strong password that only you know.", features: ["🔐 Minimum 8 characters", "🔡 At least 1 uppercase letter", "🔢 At least 1 number", "🛡️ Never shared with third parties"] },
    4: { title: "One Last Step", sub: "Tell us a bit about yourself. All profile fields are optional.", features: ["📸 Add a profile picture URL", "📍 Save your location", "💼 Your occupation", "✏️ A short bio"] },
  }[step];

  return (
    <section className="auth-page">
      <div className="auth-container">

        {/* ── Left branding panel ──────────────────────────────────── */}
        <div className="auth-branding">
          <div className="auth-branding__inner">
            <span className="auth-branding__logo">
              Valu<span style={{ color: "var(--text-accent)" }}>Al</span>tion
            </span>
            <h2 className="heading-2 auth-branding__title">{sidebarContent.title}</h2>
            <p className="body-lg text-secondary auth-branding__subtitle">{sidebarContent.sub}</p>
            <div className="auth-branding__features">
              {sidebarContent.features.map((f) => (
                <div className="auth-feature-item" key={f}>
                  <span className="auth-feature-icon">{f.slice(0, 2)}</span>
                  <span>{f.slice(2).trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right form panel ─────────────────────────────────────── */}
        <div className="auth-form-panel">
          <div className="auth-form-card glass-card">

            <StepBar current={step} />

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} /> <span>{error}</span>
              </div>
            )}

            {/* ════════════════════════════════ STEP 1 ════════════════════════════════ */}
            {step === 1 && (
              <>
                <div className="auth-form-header">
                  <h1 className="heading-3">Create Account</h1>
                  <p className="body-sm text-secondary">Enter your name and email to get started.</p>
                </div>
                <form className="auth-form" onSubmit={handleSendOtp} noValidate>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name *</label>
                    <div className="form-input-wrapper">
                      <User size={18} className="form-input-icon" />
                      <input id="fullName" type="text" className="form-input"
                        placeholder="e.g. Jane Smith" value={name}
                        onChange={e => { setName(e.target.value); clear(); }}
                        autoComplete="name" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address *</label>
                    <div className="form-input-wrapper">
                      <Mail size={18} className="form-input-icon" />
                      <input id="email" type="email" className="form-input"
                        placeholder="you@example.com" value={email}
                        onChange={e => { setEmail(e.target.value); clear(); }}
                        autoComplete="email" required />
                    </div>
                  </div>
                  <button type="submit" id="send-otp-btn"
                    className="btn btn--accent btn--full auth-submit-btn" disabled={loading}>
                    {loading ? <span className="btn-loading-spinner" /> :
                      <><Mail size={16} /> Send OTP to Email <ArrowRight size={16} /></>}
                  </button>
                </form>
                <div className="auth-form-footer">
                  <span className="body-sm text-secondary">Already have an account? </span>
                  <Link to="/signin" className="auth-link">Sign In</Link>
                </div>
              </>
            )}

            {/* ════════════════════════════════ STEP 2 ════════════════════════════════ */}
            {step === 2 && (
              <>
                <div className="auth-form-header">
                  <div className="auth-otp-icon-row">
                    <div className="auth-otp-icon-box">
                      <KeyRound size={24} style={{ color: "var(--text-accent)" }} />
                    </div>
                    <div>
                      <h1 className="heading-3" style={{ marginBottom: 0 }}>Verify Email</h1>
                      <p className="body-xs text-secondary" style={{ marginTop: 4 }}>
                        Code sent to <strong>{email}</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <form className="auth-form" onSubmit={handleVerifyOtp} noValidate>
                  <div className="form-group">
                    <label className="form-label" style={{ textAlign: "center", display: "block" }}>
                      Enter 6-Digit OTP
                    </label>
                    <OtpInput value={otp} onChange={setOtp} />
                    <p className="body-xs text-tertiary" style={{ textAlign: "center" }}>
                      {otp.replace(/\s/g, "").length}/6 digits entered
                    </p>
                  </div>
                  <button type="submit" id="verify-otp-btn"
                    className="btn btn--accent btn--full auth-submit-btn"
                    disabled={loading || otp.replace(/\s/g, "").length < 6}>
                    {loading ? <span className="btn-loading-spinner" /> :
                      <><CheckCircle size={16} /> Verify &amp; Continue <ArrowRight size={16} /></>}
                  </button>
                </form>
                <div className="auth-form-footer" style={{ flexDirection: "column", gap: "var(--space-3)" }}>
                  <button onClick={handleResend} disabled={cooldown > 0 || resending}
                    className="btn btn--ghost btn--sm" style={{ width: "100%" }}>
                    <RotateCcw size={15} />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending…" : "Resend Code"}
                  </button>
                  <button type="button" className="body-xs text-tertiary"
                    style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => { setStep(1); setOtp(""); clear(); }}>
                    ← Change email address
                  </button>
                </div>
              </>
            )}

            {/* ════════════════════════════════ STEP 3 ════════════════════════════════ */}
            {step === 3 && (
              <>
                <div className="auth-form-header">
                  <h1 className="heading-3">Set Your Password</h1>
                  <p className="body-sm text-secondary">
                    Choose a strong password for your account.
                  </p>
                </div>
                <form className="auth-form" onSubmit={handleSetPassword} noValidate>
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Password *</label>
                    <div className="form-input-wrapper">
                      <Lock size={18} className="form-input-icon" />
                      <input id="password" type={showPw ? "text" : "password"}
                        className="form-input" placeholder="Create a strong password"
                        value={password} onChange={e => { setPassword(e.target.value); clear(); }}
                        autoComplete="new-password" required />
                      <button type="button" className="form-input-toggle"
                        onClick={() => setShowPw(v => !v)}>
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {password && (
                      <div className="password-checks">
                        {checks.map(({ label, met }) => (
                          <div key={label} className={`password-check-item ${met ? "password-check-item--met" : ""}`}>
                            {met
                              ? <CheckCircle size={13} />
                              : <div style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid currentColor" }} />}
                            <span className="body-xs">{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button type="submit" id="set-password-btn"
                    className="btn btn--accent btn--full auth-submit-btn"
                    disabled={!pwValid}>
                    <Lock size={16} /> Continue to Profile <ArrowRight size={16} />
                  </button>
                </form>
              </>
            )}

            {/* ════════════════════════════════ STEP 4 ════════════════════════════════ */}
            {step === 4 && (
              <>
                <div className="auth-form-header">
                  <h1 className="heading-3">Complete Your Profile</h1>
                  <p className="body-sm text-secondary">
                    All fields below are <em>optional</em> — you can update them later.
                  </p>
                </div>
                <form className="auth-form" onSubmit={handleCompleteProfile} noValidate>
                  <div className="profile-form-grid">

                    {/* Contact */}
                    <p className="profile-section-label">Contact</p>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                      <div className="form-input-wrapper">
                        <Phone size={16} className="form-input-icon" />
                        <input id="phoneNumber" name="phoneNumber" type="tel"
                          className="form-input" placeholder="+1 (555) 000-0000"
                          value={profile.phoneNumber} onChange={profileChange} />
                      </div>
                    </div>

                    {/* Personal */}
                    <p className="profile-section-label">Personal</p>
                    <div className="profile-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="age">Age</label>
                        <div className="form-input-wrapper">
                          <User size={16} className="form-input-icon" />
                          <input id="age" name="age" type="number"
                            className="form-input" placeholder="e.g. 28"
                            min="13" max="120" value={profile.age} onChange={profileChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="gender">Gender</label>
                        <div className="form-input-wrapper">
                          <ChevronDown size={16} className="form-input-icon" />
                          <select id="gender" name="gender" className="form-input form-select"
                            value={profile.gender} onChange={profileChange}>
                            <option value="">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="occupation">Occupation</label>
                      <div className="form-input-wrapper">
                        <Briefcase size={16} className="form-input-icon" />
                        <input id="occupation" name="occupation" type="text"
                          className="form-input" placeholder="e.g. Software Engineer"
                          value={profile.occupation} onChange={profileChange} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="bio">Short Bio</label>
                      <div className="form-input-wrapper" style={{ alignItems: "flex-start" }}>
                        <FileText size={16} className="form-input-icon" style={{ marginTop: 14 }} />
                        <textarea id="bio" name="bio" className="form-input" rows={3}
                          placeholder="Tell us a little about yourself…"
                          value={profile.bio} onChange={profileChange}
                          style={{ resize: "none", height: "auto", paddingTop: 12 }} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="profilePictureUrl">
                        Profile Picture URL
                      </label>
                      <div className="form-input-wrapper">
                        <Image size={16} className="form-input-icon" />
                        <input id="profilePictureUrl" name="profilePictureUrl" type="url"
                          className="form-input" placeholder="https://example.com/photo.jpg"
                          value={profile.profilePictureUrl} onChange={profileChange} />
                      </div>
                    </div>

                    {/* Address */}
                    <p className="profile-section-label">Address</p>
                    <div className="form-group">
                      <label className="form-label" htmlFor="addressLine">Street Address</label>
                      <div className="form-input-wrapper">
                        <Home size={16} className="form-input-icon" />
                        <input id="addressLine" name="addressLine" type="text"
                          className="form-input" placeholder="123 Main St"
                          value={profile.addressLine} onChange={profileChange} />
                      </div>
                    </div>

                    <div className="profile-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="city">City</label>
                        <div className="form-input-wrapper">
                          <MapPin size={16} className="form-input-icon" />
                          <input id="city" name="city" type="text"
                            className="form-input" placeholder="Ames"
                            value={profile.city} onChange={profileChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="stateProvince">State</label>
                        <div className="form-input-wrapper">
                          <MapPin size={16} className="form-input-icon" />
                          <input id="stateProvince" name="stateProvince" type="text"
                            className="form-input" placeholder="Iowa"
                            value={profile.stateProvince} onChange={profileChange} />
                        </div>
                      </div>
                    </div>

                    <div className="profile-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="zipCode">ZIP / Postal Code</label>
                        <div className="form-input-wrapper">
                          <MapPin size={16} className="form-input-icon" />
                          <input id="zipCode" name="zipCode" type="text"
                            className="form-input" placeholder="50011"
                            value={profile.zipCode} onChange={profileChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="country">Country</label>
                        <div className="form-input-wrapper">
                          <MapPin size={16} className="form-input-icon" />
                          <input id="country" name="country" type="text"
                            className="form-input" placeholder="United States"
                            value={profile.country} onChange={profileChange} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-submit-row">
                    <button type="submit" id="complete-profile-btn"
                      className="btn btn--accent btn--full auth-submit-btn"
                      disabled={loading}>
                      {loading ? <span className="btn-loading-spinner" /> :
                        <><CheckCircle size={16} /> Complete Registration <ArrowRight size={16} /></>}
                    </button>
                    <button type="button" className="btn btn--ghost btn--sm"
                      onClick={handleCompleteProfile} disabled={loading}
                      style={{ marginTop: "var(--space-2)" }}>
                      Skip — I'll fill this in later
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
