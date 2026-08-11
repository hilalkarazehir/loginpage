package com.smartspirit.service;

import com.smartspirit.entity.PasswordResetToken;
import com.smartspirit.entity.User;
import com.smartspirit.entity.UserLog;
import com.smartspirit.repository.PasswordResetTokenRepository;
import com.smartspirit.repository.UserLogRepository;
import com.smartspirit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final int MAX_REQUESTS_PER_WINDOW = 3;
    private static final int RATE_LIMIT_WINDOW_MINUTES = 15;
    private static final String RESET_REQUEST_ACTION = "PASSWORD_RESET_REQUESTED";

    private final SecureRandom secureRandom = new SecureRandom();

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final UserLogRepository userLogRepository;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            UserLogRepository userLogRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.userLogRepository = userLogRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    // EMAIL İLE KULLANICI BUL
    public User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElse(null);
    }

    public String createResetToken(String email) {

        if (email == null || email.isBlank()) {
            return null;
        }

        long recentRequests = userLogRepository.countByUsernameAndActionAndCreatedDateAfter(
                email, RESET_REQUEST_ACTION, LocalDateTime.now().minusMinutes(RATE_LIMIT_WINDOW_MINUTES));

        logRequestAttempt(email);

        if (recentRequests >= MAX_REQUESTS_PER_WINDOW) {
            return null;
        }

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return null;
        }

        // Kullanıcının daha önce istediği ve hâlâ kullanılmamış token'lar varsa
        // iptal et; aynı anda birden fazla geçerli reset linki dolaşmasın.
        List<PasswordResetToken> outstanding = tokenRepository.findByUserAndUsedAtIsNull(user);
        LocalDateTime now = LocalDateTime.now();
        for (PasswordResetToken old : outstanding) {
            old.setUsedAt(now);
        }
        if (!outstanding.isEmpty()) {
            tokenRepository.saveAll(outstanding);
        }

        byte[] randomBytes = new byte[32];

        secureRandom.nextBytes(randomBytes);

        String token = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        String tokenHash = hashToken(token);

        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setTokenHash(tokenHash);
        resetToken.setUser(user);
        resetToken.setCreatedAt(now);
        resetToken.setExpiresAt(
                now.plusMinutes(15)
        );

        tokenRepository.save(resetToken);

        sendResetMail(email, token);

        return token;
    }

    private void logRequestAttempt(String email) {
        try {
            userLogRepository.save(new UserLog(email, RESET_REQUEST_ACTION, LocalDateTime.now()));
        } catch (Exception ignored) {
        }
    }

    // RESET MAILİ GÖNDER
    public void sendResetMail(String email, String token) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Smart Spirit - Şifre Sıfırlama");

        String resetLink =
                frontendBaseUrl + "/reset-password?token=" + token;

        message.setText(
                "Merhaba,\n\n" +
                        "Smart Spirit hesabınız için şifre sıfırlama isteği aldık.\n\n" +
                        "Şifrenizi yenilemek için aşağıdaki bağlantıya tıklayın:\n\n" +
                        resetLink +
                        "\n\n" +
                        "Bu bağlantı 15 dakika geçerlidir.\n\n" +
                        "Eğer bu işlemi siz başlatmadıysanız bu maili dikkate almayabilirsiniz.\n\n" +
                        "Smart Spirit"
        );

        mailSender.send(message);
    }

    // ŞİFREYİ SIFIRLA
    public boolean resetPassword(String token, String newPassword) {

        String tokenHash = hashToken(token);

        Optional<PasswordResetToken> resetTokenOptional =
                tokenRepository.findByTokenHashAndUsedAtIsNull(tokenHash);

        if (resetTokenOptional.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken =
                resetTokenOptional.get();

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        User user = resetToken.getUser();

        String encodedPassword =
                passwordEncoder.encode(newPassword);

        user.setPassword(encodedPassword);

        // Şifre değiştiği anda önceden dağıtılmış tüm access/refresh token'ları
        // geçersiz kıl: hesabın ele geçirilmiş olma ihtimaline karşı eski
        // oturumlar da kapanmış olur.
        user.setTokenVersion(user.getTokenVersion() + 1);

        userRepository.save(user);

        resetToken.setUsedAt(LocalDateTime.now());

        tokenRepository.save(resetToken);

        return true;
    }

    // GEÇERLİ TOKEN BUL
    public PasswordResetToken findValidToken(String token) {

        String tokenHash = hashToken(token);

        PasswordResetToken resetToken =
                tokenRepository
                        .findByTokenHashAndUsedAtIsNull(tokenHash)
                        .orElse(null);

        if (resetToken == null) {
            return null;
        }

        if (resetToken.getExpiresAt()
                .isBefore(LocalDateTime.now())) {
            return null;
        }

        return resetToken;
    }

    // TOKEN HASH
    private String hashToken(String token) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            StringBuilder hexString =
                    new StringBuilder();

            for (byte b : hash) {

                String hex =
                        Integer.toHexString(0xff & b);

                if (hex.length() == 1) {
                    hexString.append('0');
                }

                hexString.append(hex);
            }

            return hexString.toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Token hash oluşturulamadı",
                    e
            );
        }
    }

    // SMTP TEST MAİLİ (sadece ADMIN, bkz. SecurityConfig)
    public void sendTestMail(String email) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);


        message.setSubject(
                "Smart Spirit - Test Maili"
        );

        message.setText(
                "Merhaba,\n\n" +
                        "Bu mail Smart Spirit şifre sıfırlama sistemi için " +
                        "SMTP bağlantısını test etmek amacıyla gönderilmiştir.\n\n" +
                        "Smart Spirit"
        );

        mailSender.send(message);
    }
}