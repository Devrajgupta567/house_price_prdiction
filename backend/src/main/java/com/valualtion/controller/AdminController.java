package com.valualtion.controller;

import com.valualtion.dto.AdminAnalyticsDto;
import com.valualtion.dto.AdminUserDto;
import com.valualtion.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Admin REST controller — exposes platform-wide data for the admin dashboard.
 * All endpoints require authentication (standard JWT token).
 */
@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /** GET /api/v1/admin/users — list all registered users with valuation stats */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /** GET /api/v1/admin/users/{id} — full user profile + valuation history */
    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.getUserDetails(id));
    }

    /** GET /api/v1/admin/valuations — all platform-wide valuations with owner info */
    @GetMapping("/valuations")
    public ResponseEntity<List<Map<String, Object>>> getAllValuations() {
        return ResponseEntity.ok(adminService.getAllValuations());
    }

    /** GET /api/v1/admin/analytics — platform KPIs and analytics */
    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
