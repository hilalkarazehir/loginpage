package com.smartspirit.service;

import com.smartspirit.dto.LoginRequest;
import com.smartspirit.dto.LoginResponse;
import com.smartspirit.entity.Role;
import com.smartspirit.entity.User;
import com.smartspirit.repository.UserRepository;
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
    private UserRepository userRepository;

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
        user.setRole(role);

        when(userRepository.findByUsername("admin"))
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

        verify(userRepository).findByUsername("admin");
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
        user.setRole(role);

        when(userRepository.findByUsername("admin"))
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

        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        LoginResponse response = loginService.login(request);

        assertFalse(response.isSuccess());
        assertEquals("Kullanıcı adı veya şifre hatalı", response.getMessage());

        verify(userLogRepository).save(any());
    }

    @Test
    void shouldRefreshTokenSuccessfully() {

        String oldRefreshToken = "valid-refresh-token";

        Role role = new Role();
        role.setName("ADMIN");

        User user = new User();
        user.setUsername("admin");
        user.setRole(role);

        when(jwtUtil.isRefreshToken(oldRefreshToken)).thenReturn(true);
        when(jwtUtil.extractUsername(oldRefreshToken)).thenReturn("admin");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("admin", "ADMIN")).thenReturn("new-jwt-token");
        when(jwtUtil.generateRefreshToken("admin")).thenReturn("new-refresh-token");

        LoginResponse response = loginService.refreshToken(oldRefreshToken);

        assertTrue(response.isSuccess());
        assertEquals("admin", response.getUsername());
        assertEquals("new-jwt-token", response.getToken());
        assertEquals("new-refresh-token", response.getRefreshToken());
        assertEquals("Token yenilendi", response.getMessage());

        verify(jwtUtil).isRefreshToken(oldRefreshToken);
        verify(userRepository).findByUsername("admin");
    }

    @Test
    void shouldRejectInvalidOrExpiredRefreshToken() {

        String badRefreshToken = "expired-or-invalid-token";

        when(jwtUtil.isRefreshToken(badRefreshToken)).thenReturn(false);

        LoginResponse response = loginService.refreshToken(badRefreshToken);

        assertFalse(response.isSuccess());
        assertEquals("Geçersiz veya süresi dolmuş refresh token", response.getMessage());
        assertNull(response.getToken());

        verify(jwtUtil).isRefreshToken(badRefreshToken);
        verify(userRepository, never()).findByUsername(any());
    }
}