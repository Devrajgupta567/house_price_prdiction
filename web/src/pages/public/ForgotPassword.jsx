import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, KeyRound, RefreshCw } from "lucide-react";
import { authAPI } from "../../services/api";

const STEPS = {
  EMAIL: 1,
  OTP: 2,
  PASSWORD: 3,
  SUCCESS: 4,
};

const stepVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // Auto-focus first OTP box when entering step 2
  useEffect(() => {
    if (step === STEPS.OTP) {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  /* ── Step 1: Submit email ── */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    setError("");
    try {
      await authAPI.forgotPassword(email);
      setStep(STEPS.OTP);
      setResendTimer(60);
    } catch (err) {
      setError(err.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP box handlers ── */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (error) setError("");
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  /* ── Step 2: Verify OTP ── */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return setError("Please enter the complete 6-digit code.");
    setLoading(true);
    setError("");
    try {
      await authAPI.verifyResetOtp(email, code);
      setStep(STEPS.PASSWORD);
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    try {
      await authAPI.forgotPassword(email);
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(60);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: Reset password ── */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      await authAPI.resetPassword(email, otp.join(""), newPassword);
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Progress indicator ── */
  const ProgressBar = () => (
    <div className="fp-progress">
      {[1, 2, 3].map((s) => (
        <div key={s} className="fp-progress__item">
          <div className={`fp-progress__dot ${step > s ? "done" : step === s ? "active" : ""}`}>
            {step > s ? <CheckCircle size={14} /> : s}
          </div>
          {s < 3 && <div className={`fp-progress__line ${step > s ? "done" : ""}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <section className="auth-page">
      <div className="auth-container">
        {/* ── Left branding ── */}
        <div className="auth-branding">
          <div className="auth-branding__inner">
            <Link to="/" className="auth-branding__logo">
              Valu<span className="navbar__logo-accent">Al</span>tion
            </Link>
            <h2 className="heading-2 auth-branding__title">Reset Password</h2>
            <p className="body-lg text-secondary auth-branding__subtitle">
              Secure your account in three simple steps.
            </p>
            <div className="auth-branding__features">
              <div className="auth-feature-item">
                <span className="auth-feature-icon">📧</span>
                <span>Enter your registered email</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">🔢</span>
                <span>Verify with a 6-digit code</span>
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-icon">🔐</span>
                <span>Set a new secure password</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-form-panel">
          <div className="auth-form-card glass-card">

            {step !== STEPS.SUCCESS && (
              <>
                <div className="auth-form-header">
                  <h1 className="heading-3">
                    {step === STEPS.EMAIL && "Forgot Password"}
                    {step === STEPS.OTP && "Verify Code"}
                    {step === STEPS.PASSWORD && "New Password"}
                  </h1>
                  <p className="body-sm text-secondary">
                    {step === STEPS.EMAIL && "Enter your email to receive a reset code"}
                    {step === STEPS.OTP && `We sent a 6-digit code to ${email}`}
                    {step === STEPS.PASSWORD && "Choose a strong new password"}
                  </p>
                </div>
                <ProgressBar />
              </>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="auth-error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Email ── */}
              {step === STEPS.EMAIL && (
                <motion.form
                  key="step-email"
                  variants={stepVariants}
                  initial="initial" animate="animate" exit="exit"
                  onSubmit={handleEmailSubmit}
                  className="auth-form"
                  id="fp-email-form"
                >
                  <div className="form-group">
                    <label className="form-label" htmlFor="fp-email">Email Address</label>
                    <div className="form-input-wrapper">
                      <Mail size={18} className="form-input-icon" />
                      <input
                        id="fp-email"
                        type="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--accent btn--lg btn--full auth-submit-btn"
                    disabled={loading}
                    id="fp-send-code-btn"
                  >
                    {loading ? <span className="btn-loading-spinner" /> : (
                      <><Mail size={18} /> Send Reset Code</>
                    )}
                  </button>

                  <div className="auth-form-footer">
                    <p className="body-sm text-secondary">
                      Remember it?{" "}
                      <Link to="/signin" className="auth-link">Sign in</Link>
                    </p>
                  </div>
                </motion.form>
              )}

              {/* ── STEP 2: OTP ── */}
              {step === STEPS.OTP && (
                <motion.form
                  key="step-otp"
                  variants={stepVariants}
                  initial="initial" animate="animate" exit="exit"
                  onSubmit={handleOtpSubmit}
                  className="auth-form"
                  id="fp-otp-form"
                >
                  <div className="fp-otp-grid" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        id={`fp-otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={`fp-otp-box ${digit ? "filled" : ""}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn btn--accent btn--lg btn--full auth-submit-btn"
                    disabled={loading || otp.join("").length !== 6}
                    id="fp-verify-otp-btn"
                  >
                    {loading ? <span className="btn-loading-spinner" /> : (
                      <>Verify Code <ArrowRight size={18} /></>
                    )}
                  </button>

                  <div className="auth-form-footer">
                    <button
                      type="button"
                      className={`fp-resend-btn ${resendTimer > 0 ? "disabled" : ""}`}
                      onClick={handleResend}
                      disabled={resendTimer > 0 || loading}
                      id="fp-resend-btn"
                    >
                      <RefreshCw size={14} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* ── STEP 3: New Password ── */}
              {step === STEPS.PASSWORD && (
                <motion.form
                  key="step-password"
                  variants={stepVariants}
                  initial="initial" animate="animate" exit="exit"
                  onSubmit={handlePasswordSubmit}
                  className="auth-form"
                  id="fp-password-form"
                >
                  <div className="form-group">
                    <label className="form-label" htmlFor="fp-new-password">New Password</label>
                    <div className="form-input-wrapper">
                      <Lock size={18} className="form-input-icon" />
                      <input
                        id="fp-new-password"
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="form-input-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="fp-confirm-password">Confirm Password</label>
                    <div className="form-input-wrapper">
                      <Lock size={18} className="form-input-icon" />
                      <input
                        id="fp-confirm-password"
                        type={showConfirm ? "text" : "password"}
                        className="form-input"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="form-input-toggle"
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label={showConfirm ? "Hide" : "Show"}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* Password match indicator */}
                    {confirmPassword && (
                      <p className={`fp-match-hint ${newPassword === confirmPassword ? "match" : "no-match"}`}>
                        {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn--accent btn--lg btn--full auth-submit-btn"
                    disabled={loading}
                    id="fp-reset-btn"
                  >
                    {loading ? <span className="btn-loading-spinner" /> : (
                      <><KeyRound size={18} /> Reset Password</>
                    )}
                  </button>
                </motion.form>
              )}

              {/* ── STEP 4: Success ── */}
              {step === STEPS.SUCCESS && (
                <motion.div
                  key="step-success"
                  variants={stepVariants}
                  initial="initial" animate="animate" exit="exit"
                  className="fp-success"
                  id="fp-success-panel"
                >
                  <motion.div
                    className="fp-success__icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  >
                    <CheckCircle size={56} />
                  </motion.div>
                  <h2 className="heading-3">Password Reset!</h2>
                  <p className="body-md text-secondary">
                    Your password has been updated successfully.
                    You can now sign in with your new password.
                  </p>
                  <button
                    className="btn btn--accent btn--lg btn--full"
                    onClick={() => navigate("/signin")}
                    id="fp-go-signin-btn"
                  >
                    Sign In Now <ArrowRight size={18} />
                  </button>
                  <Link to="/" className="fp-success__home-link">Back to Home</Link>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
