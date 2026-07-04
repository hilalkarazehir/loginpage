package com.smartspirit.controller;

import com.smartspirit.dto.LogEntryResponse;
import com.smartspirit.exception.InvalidTokenException;
import com.smartspirit.repository.UserLogRepository;
import com.smartspirit.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {

    private final JwtUtil jwtUtil;
    private final UserLogRepository userLogRepository;

    public LogController(JwtUtil jwtUtil, UserLogRepository userLogRepository) {
        this.jwtUtil = jwtUtil;
        this.userLogRepository = userLogRepository;
    }

    @GetMapping
    public ResponseEntity<List<LogEntryResponse>> getLogs(
            @RequestHeader("Authorization") String authorizationHeader) {

        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new InvalidTokenException("Yetkilendirme başlığı 'Bearer' ile başlamalı");
        }

        String token = authorizationHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        String role = jwtUtil.extractRole(token);

        if (username == null) {
            throw new InvalidTokenException("Token geçersiz veya süresi dolmuş");
        }

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new InvalidTokenException("Bu kaynağa erişim yetkiniz yok");
        }

        List<LogEntryResponse> logs = userLogRepository.findAllByOrderByCreatedDateDesc()
                .stream()
                .map(log -> new LogEntryResponse(log.getUsername(), log.getAction(), log.getCreatedDate()))
                .limit(100)
                .toList();

        return ResponseEntity.ok(logs);
    }
}