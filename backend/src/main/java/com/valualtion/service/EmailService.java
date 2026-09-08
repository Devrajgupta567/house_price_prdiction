package com.valualtion.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${app.email.from:no-reply@valualtion.com}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends (or logs) an OTP email to the given address.
     *
     * @param toEmail   recipient email
     * @param fullName  recipient display name
     * @param otp       6-digit code
     */
    public void sendOtpEmail(String toEmail, String fullName, String otp) {
        // Always log OTP to console for development / debugging
        log.info("=======================================================");
        log.info("  OTP for {} ({}) → {}", fullName, toEmail, otp);
        log.info("  (valid for 10 minutes)");
        log.info("=======================================================");

        if (!emailEnabled) {
            log.info("  [EMAIL DISABLED] OTP printed above — configure SMTP to send real emails.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, "ValuAltion");
            helper.setTo(toEmail);
            helper.setSubject("Your ValuAltion Verification Code: " + otp);
            helper.setText(buildOtpHtml(fullName, otp), true);

            mailSender.send(message);
            log.info("OTP email successfully sent to {}", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send OTP email to {}: {}", toEmail, ex.getMessage(), ex);
            // Do NOT rethrow — OTP is already logged above so the user can still proceed
        }
    }

    private String buildOtpHtml(String name, String otp) {
        String[] digits = otp.split("");
        StringBuilder digitBoxes = new StringBuilder();
        for (String d : digits) {
            digitBoxes.append(
                "<td style='padding:0 6px'>"
                + "<span style='display:inline-block;width:44px;height:52px;line-height:52px;"
                + "text-align:center;font-size:28px;font-weight:700;font-family:monospace;"
                + "background:#1a1a2e;color:#c5a55a;border:2px solid #c5a55a;"
                + "border-radius:8px;'>" + d + "</span></td>"
            );
        }

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head><meta charset="UTF-8"><title>Verify Your Email</title></head>
            <body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#16213e;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:40px 48px 24px;text-align:center;background:linear-gradient(135deg,#1a1a2e,#16213e);">
                    <h1 style="margin:0;font-size:26px;color:#ffffff;">
                      Valu<span style="color:#c5a55a;">Al</span>tion
                    </h1>
                    <p style="color:#8a8a9a;font-size:13px;margin:8px 0 0;">AI-Powered Property Valuation</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 48px;">
                    <h2 style="color:#ffffff;font-size:20px;margin:0 0 8px;">Hi %s,</h2>
                    <p style="color:#a0a0b0;font-size:15px;line-height:1.6;margin:0 0 28px;">
                      Use the verification code below to complete your registration.<br>
                      This code expires in <strong style="color:#c5a55a;">10 minutes</strong>.
                    </p>
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                      <tr>%s</tr>
                    </table>
                    <p style="color:#606070;font-size:13px;text-align:center;margin:0;">
                      If you did not request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 48px;background:#0f0f1a;text-align:center;">
                    <p style="color:#404050;font-size:12px;margin:0;">
                      &copy; 2026 ValuAltion — AI Property Valuation Platform
                    </p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(name, digitBoxes.toString());
    }

    /**
     * Sends (or logs) a password-reset OTP email.
     */
    public void sendPasswordResetEmail(String toEmail, String fullName, String otp) {
        log.info("=======================================================");
        log.info("  PASSWORD RESET OTP for {} ({}) → {}", fullName, toEmail, otp);
        log.info("  (valid for 10 minutes)");
        log.info("=======================================================");

        if (!emailEnabled) {
            log.info("  [EMAIL DISABLED] OTP printed above — configure SMTP to send real emails.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress, "ValuAltion");
            helper.setTo(toEmail);
            helper.setSubject("ValuAltion Password Reset Code: " + otp);
            helper.setText(buildResetHtml(fullName, otp), true);
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send password reset email to {}: {}", toEmail, ex.getMessage(), ex);
        }
    }

    private String buildResetHtml(String name, String otp) {
        String[] digits = otp.split("");
        StringBuilder digitBoxes = new StringBuilder();
        for (String d : digits) {
            digitBoxes.append(
                "<td style='padding:0 6px'>"
                + "<span style='display:inline-block;width:44px;height:52px;line-height:52px;"
                + "text-align:center;font-size:28px;font-weight:700;font-family:monospace;"
                + "background:#1a1a2e;color:#e05a5a;border:2px solid #e05a5a;"
                + "border-radius:8px;'>" + d + "</span></td>"
            );
        }
        return """
            <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#16213e;border-radius:16px;overflow:hidden;">
                <tr><td style="padding:40px 48px 24px;text-align:center;background:linear-gradient(135deg,#1a1a2e,#16213e);">
                  <h1 style="margin:0;font-size:26px;color:#fff;">Valu<span style="color:#c5a55a;">Al</span>tion</h1>
                  <p style="color:#8a8a9a;font-size:13px;margin:8px 0 0;">Password Reset Request</p>
                </td></tr>
                <tr><td style="padding:32px 48px;">
                  <h2 style="color:#fff;font-size:20px;margin:0 0 8px;">Hi %s,</h2>
                  <p style="color:#a0a0b0;font-size:15px;line-height:1.6;margin:0 0 28px;">
                    Use the code below to reset your password.<br>
                    This code expires in <strong style="color:#e05a5a;">10 minutes</strong>.
                  </p>
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;"><tr>%s</tr></table>
                  <p style="color:#606070;font-size:13px;text-align:center;margin:0;">
                    If you did not request this, ignore this email.
                  </p>
                </td></tr>
                <tr><td style="padding:20px 48px;background:#0f0f1a;text-align:center;">
                  <p style="color:#404050;font-size:12px;margin:0;">&copy; 2026 ValuAltion</p>
                </td></tr>
              </table>
            </body></html>
            """.formatted(name, digitBoxes.toString());
    }

    /**
     * Sends a full property valuation report to the homeowner with breakdown and PDF attachment.
     */
    public void sendValuationReportEmail(String toEmail, String fullName, com.valualtion.dto.ValuationResponse val, byte[] pdfAttachment) {
        log.info("Preparing valuation report email for {} ({}) - Estimated: ${}", fullName, toEmail, val.getEstimatedValue());

        if (!emailEnabled) {
            log.info("  [EMAIL DISABLED] Email notification logged above — configure SMTP to send live emails.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            boolean hasAttachment = pdfAttachment != null && pdfAttachment.length > 0;
            MimeMessageHelper helper = new MimeMessageHelper(message, hasAttachment, "UTF-8");

            helper.setFrom(fromAddress, "ValuAltion Appraisals");
            helper.setTo(toEmail);
            helper.setSubject("Your Official ValuAltion Property Report — " + formatCurrency(val.getEstimatedValue()));
            helper.setText(buildValuationReportHtml(fullName, val), true);

            if (hasAttachment) {
                helper.addAttachment("ValuAltion-Property-Report.pdf", new org.springframework.core.io.ByteArrayResource(pdfAttachment));
            }

            mailSender.send(message);
            log.info("Valuation report email successfully sent to {}", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send valuation report email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new RuntimeException("Failed to send valuation report email: " + ex.getMessage());
        }
    }

    private String formatCurrency(Double amount) {
        if (amount == null) return "$0";
        return String.format("$%,.0f", amount);
    }

    private String buildValuationReportHtml(String name, com.valualtion.dto.ValuationResponse val) {
        StringBuilder driverRows = new StringBuilder();
        if (val.getAttributions() != null && !val.getAttributions().isEmpty()) {
            for (com.valualtion.dto.FeatureAttributionDto attr : val.getAttributions()) {
                String color = "POSITIVE".equalsIgnoreCase(attr.getImpact()) ? "#10b981" : "#f43f5e";
                driverRows.append("""
                    <tr>
                      <td style="padding:10px 12px;border-bottom:1px solid #242c44;color:#e2e8f0;font-size:14px;font-weight:600;">%s</td>
                      <td style="padding:10px 12px;border-bottom:1px solid #242c44;color:#94a3b8;font-size:13px;">%s</td>
                      <td style="padding:10px 12px;border-bottom:1px solid #242c44;color:%s;font-size:14px;font-weight:700;text-align:right;">%s</td>
                    </tr>
                """.formatted(attr.getFeatureName(), attr.getDetailDescription(), color, attr.getFormattedAmount()));
            }
        }

        String address = val.getAddress() != null ? val.getAddress() : "Ames, Iowa";
        String low = formatCurrency(val.getRangeLow());
        String high = formatCurrency(val.getRangeHigh());
        int confidencePct = val.getConfidenceScore() != null ? (int) Math.round(val.getConfidenceScore() * 100) : 92;

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head><meta charset="UTF-8"><title>Property Valuation Report</title></head>
            <body style="margin:0;padding:0;background:#0b0f19;font-family:'Segoe UI',Arial,sans-serif;color:#f8fafc;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:30px auto;background:#111827;border-radius:16px;border:1px solid #1f293d;overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding:32px 40px;text-align:center;background:linear-gradient(135deg,#0d1322,#151f38);border-bottom:1px solid #1f293d;">
                    <h1 style="margin:0;font-size:26px;letter-spacing:1px;color:#ffffff;">
                      Valu<span style="color:#d4af37;">Al</span>tion
                    </h1>
                    <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;letter-spacing:0.5px;">OFFICIAL AI PROPERTY VALUATION DOSSIER</p>
                  </td>
                </tr>

                <!-- Summary Card -->
                <tr>
                  <td style="padding:32px 40px;">
                    <p style="color:#94a3b8;font-size:14px;margin:0 0 4px;">Property Appraisal For</p>
                    <h2 style="color:#ffffff;font-size:20px;margin:0 0 20px;">%s</h2>

                    <div style="background:#17223b;border:1px solid #2d3b5e;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                      <span style="color:#d4af37;font-size:12px;text-transform:uppercase;font-weight:700;letter-spacing:1px;">Estimated Market Value</span>
                      <div style="font-size:36px;font-weight:800;color:#ffffff;margin:8px 0 12px;">%s</div>
                      <div style="color:#94a3b8;font-size:14px;">
                        Range: <strong style="color:#e2e8f0;">%s</strong> &mdash; <strong style="color:#e2e8f0;">%s</strong>
                        &nbsp;|&nbsp; Accuracy: <strong style="color:#10b981;">%d%% (%s)</strong>
                      </div>
                    </div>

                    <!-- Key Value Drivers (Explainable AI) -->
                    <h3 style="color:#ffffff;font-size:16px;margin:0 0 12px;border-bottom:1px solid #1f293d;padding-bottom:8px;">
                      Key Value Drivers (Explainable AI Attribution)
                    </h3>
                    <table width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <thead>
                        <tr style="background:#0d1322;">
                          <th style="padding:8px 12px;text-align:left;color:#94a3b8;font-size:12px;">Feature</th>
                          <th style="padding:8px 12px;text-align:left;color:#94a3b8;font-size:12px;">Specification</th>
                          <th style="padding:8px 12px;text-align:right;color:#94a3b8;font-size:12px;">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        %s
                      </tbody>
                    </table>

                    <div style="text-align:center;padding:12px 0;">
                      <a href="http://localhost:5173/dashboard" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#d4af37,#aa820a);color:#0b0f19;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
                        View Portfolio in Dashboard &rarr;
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;background:#090d16;text-align:center;border-top:1px solid #1a2236;">
                    <p style="color:#64748b;font-size:12px;margin:0;">
                      &copy; 2026 ValuAltion Real Estate Intelligence. USPAP Compliant AVM.
                    </p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
        """.formatted(
            address,
            formatCurrency(val.getEstimatedValue()),
            low,
            high,
            confidencePct,
            val.getConfidenceLevel(),
            driverRows.toString()
        );
    }
}
