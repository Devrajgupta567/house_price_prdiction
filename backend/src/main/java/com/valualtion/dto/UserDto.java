package com.valualtion.dto;

import com.valualtion.entity.User;
import java.time.LocalDateTime;
import java.util.UUID;

public class UserDto {

    private UUID id;
    private String email;
    private String fullName;
    private String role;
    private boolean verified;
    private String phoneNumber;
    private Integer age;
    private String gender;
    private String occupation;
    private String bio;
    private String profilePictureUrl;
    private String addressLine;
    private String city;
    private String stateProvince;
    private String zipCode;
    private String country;
    private LocalDateTime createdAt;
    private LocalDateTime profileCompletedAt;

    public UserDto() {}

    public UserDto(UUID id, String email, String fullName, String role, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static UserDto fromEntity(User u) {
        if (u == null) return null;
        UserDto dto = new UserDto();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setFullName(u.getFullName());
        dto.setRole(u.getRole());
        dto.setVerified(u.isVerified());
        dto.setPhoneNumber(u.getPhoneNumber());
        dto.setAge(u.getAge());
        dto.setGender(u.getGender());
        dto.setOccupation(u.getOccupation());
        dto.setBio(u.getBio());
        dto.setProfilePictureUrl(u.getProfilePictureUrl());
        dto.setAddressLine(u.getAddressLine());
        dto.setCity(u.getCity());
        dto.setStateProvince(u.getStateProvince());
        dto.setZipCode(u.getZipCode());
        dto.setCountry(u.getCountry());
        dto.setCreatedAt(u.getCreatedAt());
        dto.setProfileCompletedAt(u.getProfileCompletedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

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
