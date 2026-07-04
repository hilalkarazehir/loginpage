package com.smartspirit.controller;

import com.smartspirit.dto.UserProfileResponse;
import com.smartspirit.exception.InvalidTokenException;
import com.smartspirit.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    private final JwtUtil jwtUtil;

    public UserProfileController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@RequestHeader("Authorization") String authorizationHeader) {
        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Yetkilendirme başlığı 'Bearer' ile başlamalı");
        }

        String token = authorizationHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        if (username == null) {
            throw new InvalidTokenException("Token geçersiz veya süresi dolmuş");
        }

        UserProfileResponse response = new UserProfileResponse(username, "Hoş geldin, " + username);
        return ResponseEntity.ok(response);
    }
}