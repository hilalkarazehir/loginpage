package com.smartspirit.api.service;

import com.smartspirit.api.dto.LoginRequest;
import com.smartspirit.api.dto.LoginResponse;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    // Sahte kullanıcılar — ileride DB'ye bağlanacak
    public LoginResponse login(LoginRequest request) {
        if ("admin".equals(request.getUsername()) && "1234".equals(request.getPassword())) {
            return new LoginResponse("Giriş başarılı", request.getUsername(), true);
        }
        return new LoginResponse("Kullanıcı adı veya şifre hatalı", null, false);
    }
}