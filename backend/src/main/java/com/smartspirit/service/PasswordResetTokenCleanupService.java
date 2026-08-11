package com.smartspirit.service;

import com.smartspirit.repository.PasswordResetTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * password_reset_tokens tablosunun süresiz büyümesini engeller.
 * Süresi dolmuş (expiresAt < şimdi) kayıtları periyodik olarak temizler.
 * Kullanılmış (usedAt dolu) ama henüz süresi dolmamış kayıtlar bilerek
 * dokunulmadan bırakılır; bir sonraki temizlik döngüsünde expiresAt
 * geçtiğinde onlar da silinir.
 */
@Service
public class PasswordResetTokenCleanupService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetTokenCleanupService.class);

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetTokenCleanupService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Her gün 04:00'te çalışır (sunucu saat dilimine göre).
    @Scheduled(cron = "0 0 4 * * *")
    @Transactional
    public void purgeExpiredTokens() {
        int deleted = tokenRepository.deleteAllExpiredBefore(LocalDateTime.now());
        if (deleted > 0) {
            log.info("Süresi dolmuş {} adet şifre sıfırlama token'ı temizlendi.", deleted);
        }
    }
}
