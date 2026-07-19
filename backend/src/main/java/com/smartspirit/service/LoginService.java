package com.smartspirit.service;

import com.smartspirit.dto.LoginRequest;
import com.smartspirit.dto.LoginResponse;
import com.smartspirit.entity.User;
import com.smartspirit.entity.UserLog;
import com.smartspirit.repository.UserRepository;
import com.smartspirit.repository.UserLogRepository;
import com.smartspirit.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserLogRepository userLogRepository;

    public LoginService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil, UserLogRepository userLogRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
         this.jwtUtil = jwtUtil;
        this.userLogRepository = userLogRepository;
    }

    public LoginResponse login(LoginRequest request) {

         final int MAX_FAILED_ATTEMPTS = 5;

         final int LOCKOUT_MINUTES = 15;

        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        String username = request.getUsername();

        long recentFailures = userLogRepository.countByUsernameAndActionAndCreatedDateAfter(
                username, "LOGIN_FAILED_INVALID_CREDENTIALS", LocalDateTime.now().minusMinutes(LOCKOUT_MINUTES));

        if (recentFailures >= MAX_FAILED_ATTEMPTS) {
            logAttempt(username, "LOGIN_BLOCKED_TOO_MANY_ATTEMPTS");
            return new LoginResponse(
                    "Çok fazla başarısız deneme yapıldı. Lütfen " + LOCKOUT_MINUTES + " dakika sonra tekrar deneyin.",
                    null, false, null);
        }
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logAttempt(request.getUsername(), "LOGIN_FAILED_INVALID_CREDENTIALS");
            return new LoginResponse("Kullanıcı adı veya şifre hatalı", null, false, null);
        }

        if (!user.isActive()) {
            logAttempt(user.getUsername(), "LOGIN_FAILED_INACTIVE_ACCOUNT");
            return new LoginResponse("Hesap aktif değil", null, false, null);
        }

        logAttempt(user.getUsername(), "LOGIN_SUCCESS");
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().getName());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        return new LoginResponse("Giriş başarılı", user.getUsername(), true, token, refreshToken);
    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isRefreshToken(refreshToken)) {
            return new LoginResponse("Geçersiz veya süresi dolmuş refresh token", null, false, null);
        }

        String username = jwtUtil.extractUsername(refreshToken);
        if (username == null) {
            return new LoginResponse("Geçersiz veya süresi dolmuş refresh token", null, false, null);
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null || !user.isActive()) {
            return new LoginResponse("Kullanıcı bulunamadı veya aktif değil", null, false, null);
        }

        String newToken = jwtUtil.generateToken(user.getUsername(), user.getRole().getName());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        return new LoginResponse("Token yenilendi", user.getUsername(), true, newToken, newRefreshToken);
    }
    private void logAttempt(String username, String action) {
        try {
            userLogRepository.save(new UserLog(username, action, LocalDateTime.now()));
        } catch (Exception e) {

        }
    }
}