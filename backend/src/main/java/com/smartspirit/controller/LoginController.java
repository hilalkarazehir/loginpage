package com.smartspirit.controller;
import com.smartspirit.dto.ResetPasswordRequest;
import com.smartspirit.dto.LoginRequest;
import com.smartspirit.dto.LoginResponse;
import com.smartspirit.dto.RefreshTokenRequest;
import com.smartspirit.service.LoginService;
import com.smartspirit.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final LoginService loginService;
    private final PasswordResetService passwordResetService;

    public LoginController(
            LoginService loginService,
            PasswordResetService passwordResetService
    ) {
        this.loginService = loginService;
        this.passwordResetService = passwordResetService;
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = loginService.login(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(response);
    }
    // Kullanıcının sistemde kayıtlı olup olmadığını (email enumeration) sızdırmamak
    // için token null da dönse, gerçekten oluşturulsa da her zaman AYNI mesaj döner.
    private static final String FORGOT_PASSWORD_GENERIC_MESSAGE =
            "Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.";

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request
    ) {

        String email = request.get("email");

        // Dönüş değeri kasıtlı olarak kullanılmıyor; hem "kullanıcı yok" hem
        // "kullanıcı var, mail gönderildi" durumunda aynı response dönülüyor.
        passwordResetService.createResetToken(email);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", FORGOT_PASSWORD_GENERIC_MESSAGE
                )
        );
    }
    // REFRESH TOKEN
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ) {

        LoginResponse response =
                loginService.refreshToken(request.getRefreshToken());

        if (!response.isSuccess()) {
            return ResponseEntity.status(401).body(response);
        }

        return ResponseEntity.ok(response);
    }

    // TOKEN VALIDATION
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(
            Authentication authentication
    ) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(401)
                    .body(Map.of("valid", false));
        }

        return ResponseEntity.ok(
                Map.of(
                        "valid", true,
                        "username", authentication.getName()
                )
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        boolean success = passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        if (!success) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "success", false,
                            "message", "Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı."
                    )
            );
        }

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Şifreniz başarıyla değiştirildi."
                )
        );
    }
}