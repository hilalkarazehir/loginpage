package com.smartspirit.service;

import com.smartspirit.dto.LoginRequest;
import com.smartspirit.dto.LoginResponse;
import com.smartspirit.entity.Role;
import com.smartspirit.entity.User;
import com.smartspirit.repository.LoginRepository;
import com.smartspirit.repository.UserLogRepository;
import com.smartspirit.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private LoginRepository loginRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserLogRepository userLogRepository;

    @InjectMocks
    private LoginService loginService;

    @Test
    void shouldLoginSuccessfully() {

        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("123456");

        Role role = new Role();
        role.setName("ADMIN");

        User user = new User();
        user.setUsername("admin");
        user.setPassword("encodedPassword");
        user.setActive(true);
        user.setRole(role);

        when(loginRepository.findByUsername("admin"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("123456", "encodedPassword"))
                .thenReturn(true);

        when(jwtUtil.generateToken("admin", "ADMIN"))
                .thenReturn("jwt-token");

        when(jwtUtil.generateRefreshToken("admin"))
                .thenReturn("refresh-token");

        LoginResponse response = loginService.login(request);

        assertTrue(response.isSuccess());
        assertEquals("admin", response.getUsername());
        assertEquals("jwt-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("Giriş başarılı", response.getMessage());

        verify(loginRepository).findByUsername("admin");
        verify(userLogRepository).save(any());
    }
    @Test
    void shouldRejectInvalidPassword() {

        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("yanlisSifre");

        Role role = new Role();
        role.setName("ADMIN");

        User user = new User();
        user.setUsername("admin");
        user.setPassword("encodedPassword");
        user.setActive(true);
        user.setRole(role);

        when(loginRepository.findByUsername("admin"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("yanlisSifre", "encodedPassword"))
                .thenReturn(false);

        LoginResponse response = loginService.login(request);

        assertFalse(response.isSuccess());
        assertEquals("Kullanıcı adı veya şifre hatalı", response.getMessage());

        verify(userLogRepository).save(any());
    }
    @Test
    void shouldRejectUnknownUser() {

        LoginRequest request = new LoginRequest();
        request.setUsername("unknown");
        request.setPassword("123456");

        when(loginRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        LoginResponse response = loginService.login(request);

        assertFalse(response.isSuccess());
        assertEquals("Kullanıcı adı veya şifre hatalı", response.getMessage());

        verify(userLogRepository).save(any());
    }
}