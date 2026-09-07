package com.valualtion.service;

import com.valualtion.dto.*;
import com.valualtion.entity.User;
import com.valualtion.repository.UserRepository;
import com.valualtion.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Collections;

@Service
public class AuthService {

    private static final int OTP_EXPIRY_MINUTES = 10;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1 — Initiate signup: name + email → send OTP
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse initiateSignup(InitiateSignupRequest request) {
        // If the email exists but is already verified, reject immediately
        userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            if (existing.isVerified()) {
                throw new IllegalArgumentException("An account with this email already exists. Please sign in.");
            }
            // If unverified (previous attempt), delete so we can restart cleanly
            userRepository.delete(existing);
            userRepository.flush();
        });

        String otp = generateOtp();

        User user = new User(request.getEmail(), request.getFullName());
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        userRepository.save(user);

        // Send OTP email (or log to console if email is disabled)
        emailService.sendOtpEmail(request.getEmail(), request.getFullName(), otp);

        return AuthResponse.pendingVerification(request.getEmail(), request.getFullName());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2 — Verify OTP
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        User user = findUnverifiedUser(request.getEmail());

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            throw new BadCredentialsException("Invalid OTP code. Please check and try again.");
        }
        if (user.getOtpExpiry() == null || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new BadCredentialsException("OTP has expired. Please request a new one.");
        }

        // Mark email verified but do NOT issue JWT yet — password not set
        user.setVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return AuthResponse.otpVerified(request.getEmail(), user.getFullName());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3 — Complete profile: set password + all profile info → issue JWT
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse completeProfile(CompleteProfileRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Account not found for: " + request.getEmail()));

        if (!user.isVerified()) {
            throw new BadCredentialsException("Email not verified. Please complete OTP verification first.");
        }
        if (user.getPassword() != null) {
            throw new IllegalStateException("Profile already completed. Please sign in.");
        }

        // Set password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set profile fields
        if (request.getPhoneNumber()      != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getAge()              != null) user.setAge(request.getAge());
        if (request.getGender()           != null) user.setGender(request.getGender());
        if (request.getOccupation()       != null) user.setOccupation(request.getOccupation());
        if (request.getBio()              != null) user.setBio(request.getBio());
        if (request.getProfilePictureUrl()!= null) user.setProfilePictureUrl(request.getProfilePictureUrl());
        if (request.getAddressLine()      != null) user.setAddressLine(request.getAddressLine());
        if (request.getCity()             != null) user.setCity(request.getCity());
        if (request.getStateProvince()    != null) user.setStateProvince(request.getStateProvince());
        if (request.getZipCode()          != null) user.setZipCode(request.getZipCode());
        if (request.getCountry()          != null) user.setCountry(request.getCountry());

        user.setProfileCompletedAt(LocalDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Resend OTP
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void resendOtp(String email) {
        User user = findUnverifiedUser(email);

        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        userRepository.save(user);

        emailService.sendOtpEmail(email, user.getFullName(), otp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Login
    // ─────────────────────────────────────────────────────────────────────────
    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getEmail()));

        if (!user.isVerified()) {
            throw new BadCredentialsException("Email not yet verified. Please check your inbox for the OTP.");
        }
        if (user.getPassword() == null) {
            throw new BadCredentialsException("Registration is incomplete. Please finish setting up your profile.");
        }

        return buildAuthResponse(user);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Legacy register (kept for backward compat with existing tests)
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        InitiateSignupRequest init = new InitiateSignupRequest();
        init.setFullName(request.getFullName());
        init.setEmail(request.getEmail());
        return initiateSignup(init);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Current-user helpers
    // ─────────────────────────────────────────────────────────────────────────
    public UserDto getCurrentUserDto() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadCredentialsException("Not authenticated");
        }
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + auth.getName()));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(UserDto dto) {
        User user = getCurrentUserEntity();
        if (user == null) {
            throw new BadCredentialsException("Not authenticated");
        }

        if (dto.getFullName() != null && !dto.getFullName().isBlank()) user.setFullName(dto.getFullName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getAge() != null) user.setAge(dto.getAge());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getOccupation() != null) user.setOccupation(dto.getOccupation());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getProfilePictureUrl() != null) user.setProfilePictureUrl(dto.getProfilePictureUrl());
        if (dto.getAddressLine() != null) user.setAddressLine(dto.getAddressLine());
        if (dto.getCity() != null) user.setCity(dto.getCity());
        if (dto.getStateProvince() != null) user.setStateProvince(dto.getStateProvince());
        if (dto.getZipCode() != null) user.setZipCode(dto.getZipCode());
        if (dto.getCountry() != null) user.setCountry(dto.getCountry());

        userRepository.save(user);
        return UserDto.fromEntity(user);
    }

    public User getCurrentUserEntity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FORGOT PASSWORD — Step 1: Send reset OTP to email
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void sendPasswordResetOtp(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No account found for: " + request.getEmail()));

        if (!user.isVerified() || user.getPassword() == null) {
            throw new IllegalStateException(
                    "Account registration is incomplete. Please finish signing up.");
        }

        String otp = generateOtp();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), otp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FORGOT PASSWORD — Step 2: Verify reset OTP
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void verifyPasswordResetOtp(VerifyResetOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No account found for: " + request.getEmail()));

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            throw new BadCredentialsException("Invalid OTP. Please check and try again.");
        }
        if (user.getOtpExpiry() == null || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new BadCredentialsException("OTP has expired. Please request a new one.");
        }
        // OTP is valid — keep it stored so step 3 can re-verify
        // (prevents skipping step 2 by going directly to step 3)
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FORGOT PASSWORD — Step 3: Reset password
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "No account found for: " + request.getEmail()));

        // Re-verify OTP so step 3 can't be hit without a valid code
        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            throw new BadCredentialsException("Invalid or expired OTP. Please restart the process.");
        }
        if (user.getOtpExpiry() == null || LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new BadCredentialsException("OTP has expired. Please restart the process.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────
    private User findUnverifiedUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No account found for: " + email));
        if (user.isVerified() && user.getPassword() != null) {
            throw new IllegalStateException("Account already registered. Please sign in.");
        }
        return user;
    }

    private String generateOtp() {
        return String.valueOf(100000 + new SecureRandom().nextInt(900000));
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails ud = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), Collections.emptyList()
        );
        return new AuthResponse(jwtService.generateToken(ud),
                user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
