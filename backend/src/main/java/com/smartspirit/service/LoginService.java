package com.smartspirit.service;

import com.smartspirit.dto.LoginRequest;
import com.smartspirit.dto.LoginResponse;
import com.smartspirit.repository.LoginRepository;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final LoginRepository loginRepository;

    public LoginService(LoginRepository loginRepository) {
        this.loginRepository = loginRepository;
    }

    public LoginResponse login(LoginRequest request) {
        return loginRepository.findByUsername(request.getUsername())
                .filter(user -> user.isActive())
                .filter(user -> user.getPassword().equals(request.getPassword()))
                .map(user -> new LoginResponse("Giriş başarılı", user.getUsername(), true))
                .orElse(new LoginResponse("Kullanıcı adı veya şifre hatalı", null, false));
    }
}