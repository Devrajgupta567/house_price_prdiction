package com.valualtion.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ── Core account fields ───────────────────────────────────────────────────
    @Column(unique = true, nullable = false)
    private String email;

    /** Nullable during OTP step — set only after Step 3 (complete profile). */
    @Column(nullable = true)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(nullable = false)
    private String role = "ROLE_HOMEOWNER";

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    // ── OTP / verification fields ─────────────────────────────────────────────
    @Column(name = "is_verified", nullable = false)
    private boolean verified = false;

    @Column(name = "otp_code", length = 6)
    private String otpCode;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;

    // ── Extended profile fields ────────────────────────────────────────────────
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_picture_url", length = 500)
    private String profilePictureUrl;

    @Column(name = "address_line", length = 255)
    private String addressLine;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state_province", length = 100)
    private String stateProvince;

    @Column(name = "zip_code", length = 20)
    private String zipCode;

    @Column(name = "country", length = 100)
    private String country = "United States";

    // ── Timestamps ────────────────────────────────────────────────────────────
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "profile_completed_at")
    private LocalDateTime profileCompletedAt;

    public User() {}

    /** Minimal constructor — used in Step 1 (only name + email known). */
    public User(String email, String fullName) {
        this.email = email;
        this.fullName = fullName;
        this.role = "ROLE_HOMEOWNER";
        this.createdAt = LocalDateTime.now();
        this.active = true;
        this.verified = false;
    }

    /** Full constructor — kept for backward compat with existing tests. */
    public User(String email, String password, String fullName, String role) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role != null ? role : "ROLE_HOMEOWNER";
        this.createdAt = LocalDateTime.now();
        this.active = true;
        this.verified = false;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public LocalDateTime getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(LocalDateTime otpExpiry) { this.otpExpiry = otpExpiry; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getStateProvince() { return stateProvince; }
    public void setStateProvince(String stateProvince) { this.stateProvince = stateProvince; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getProfileCompletedAt() { return profileCompletedAt; }
    public void setProfileCompletedAt(LocalDateTime profileCompletedAt) { this.profileCompletedAt = profileCompletedAt; }
}
