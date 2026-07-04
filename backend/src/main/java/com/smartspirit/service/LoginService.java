package com.smartspirit.service;

import com.smartspirit.dto.LoginRequest;
import com.smartspirit.dto.LoginResponse;
import com.smartspirit.entity.User;
import com.smartspirit.repository.LoginRepository;
import com.smartspirit.util.java.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final LoginRepository loginRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginService(LoginRepository loginRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.loginRepository = loginRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        User user = loginRepository.findByUsername(request.getUsername()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse("Kullanıcı adı veya şifre hatalı", null, false, null);
        }

        if (!user.isActive()) {
            return new LoginResponse("Hesap aktif değil", null, false, null);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().getName());
        return new LoginResponse("Giriş başarılı", user.getUsername(), true, token);
    }
}