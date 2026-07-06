package com.smartspirit.controller;

import com.smartspirit.dto.LoginRequest;
import com.smartspirit.dto.LoginResponse;
import com.smartspirit.dto.RefreshTokenRequest;
import com.smartspirit.service.LoginService;
import com.smartspirit.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    private final LoginService loginService;
    private final JwtUtil jwtUtil;

    public LoginController(LoginService loginService, JwtUtil jwtUtil) {
        this.loginService = loginService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = loginService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = loginService.refreshToken(request.getRefreshToken());
        if (!response.isSuccess()) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(@RequestHeader("Authorization") String authorizationHeader) {
        if (!authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("valid", false));
        }

        String token = authorizationHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("valid", false));
        }

        return ResponseEntity.ok(Map.of("valid", true, "username", username));
    }
}