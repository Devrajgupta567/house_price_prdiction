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
}
