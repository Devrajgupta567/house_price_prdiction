package com.valualtion.controller;

import com.valualtion.dto.*;
import com.valualtion.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── Step 1: Name + Email → Send OTP ─────────────────────────────────────
    @PostMapping("/initiate-signup")
    public ResponseEntity<AuthResponse> initiateSignup(
            @Valid @RequestBody InitiateSignupRequest request) {
        AuthResponse response = authService.initiateSignup(request);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    // ── Step 2: OTP → Email verified ─────────────────────────────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    // ── Step 3: Password + Profile → JWT issued ───────────────────────────────
    @PostMapping("/complete-profile")
    public ResponseEntity<AuthResponse> completeProfile(
            @Valid @RequestBody CompleteProfileRequest request) {
        AuthResponse response = authService.completeProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── Resend OTP ────────────────────────────────────────────────────────────
    @PostMapping("/resend-otp")
    public ResponseEntity<AuthResponse> resendOtp(@RequestBody Map<String, String> body) {
        AuthResponse response = authService.resendOtp(body.get("email"));
        return ResponseEntity.ok(response);
    }

    // ── Legacy signup (kept for backward compat) ──────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // ── Get current user ──────────────────────────────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(authService.getCurrentUserDto());
    }

    // ── Forgot Password — Step 1: Send OTP to email ───────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {
        authService.sendPasswordResetOtp(request);
        return ResponseEntity.ok(Map.of("message",
                "Password reset code sent to " + request.getEmail()));
    }

    // ── Forgot Password — Step 2: Verify OTP ─────────────────────────────────
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<Map<String, String>> verifyResetOtp(
            @RequestBody VerifyResetOtpRequest request) {
        authService.verifyPasswordResetOtp(request);
        return ResponseEntity.ok(Map.of("message", "OTP verified. You may now reset your password."));
    }

    // ── Forgot Password — Step 3: Reset password ──────────────────────────────
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully. Please sign in."));
    }
}
