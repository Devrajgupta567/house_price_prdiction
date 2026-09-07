package com.valualtion.controller;

import com.valualtion.dto.UserDto;
import com.valualtion.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile() {
        return ResponseEntity.ok(authService.getCurrentUserDto());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto updateDto) {
        UserDto updated = authService.updateProfile(updateDto);
        return ResponseEntity.ok(updated);
    }
}
