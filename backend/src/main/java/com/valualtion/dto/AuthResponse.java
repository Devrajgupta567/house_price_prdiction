package com.valualtion.dto;

import java.util.UUID;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private UUID id;
    private String email;
    private String fullName;
    private String role;
    /** True when OTP has been sent but not yet verified — no JWT is included. */
    private boolean pendingVerification = false;
    private boolean otpVerified = false;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, UUID id, String email, String fullName, String role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.pendingVerification = false;
    }

    /**
     * Factory: returned after registration so the frontend knows to show the OTP screen.
     * No JWT is included at this stage.
     */
    public static AuthResponse pendingVerification(String email, String fullName) {
        AuthResponse r = new AuthResponse();
        r.email = email;
        r.fullName = fullName;
        r.pendingVerification = true;
        r.message = "A 6-digit OTP has been sent to " + email + ". Please verify to continue.";
        return r;
    }

    /**
     * Factory: returned after OTP verified — tells frontend to show the profile setup screen.
     * Still no JWT — issued only after completeProfile().
     */
    public static AuthResponse otpVerified(String email, String fullName) {
        AuthResponse r = new AuthResponse();
        r.email = email;
        r.fullName = fullName;
        r.pendingVerification = false;
        r.otpVerified = true;
        r.message = "Email verified! Please set your password and complete your profile.";
        return r;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isPendingVerification() { return pendingVerification; }
    public void setPendingVerification(boolean pendingVerification) { this.pendingVerification = pendingVerification; }

    public boolean isOtpVerified() { return otpVerified; }
    public void setOtpVerified(boolean otpVerified) { this.otpVerified = otpVerified; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

