package com.smartspirit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    @NotBlank(message = "Token boş olamaz")
    private String token;

    @NotBlank(message = "Yeni şifre boş olamaz")
    @Size(min = 8, max = 15, message = "Şifre 8-15 karakter arasında olmalıdır")
    @Pattern(regexp = "^\\S+$", message = "Şifre boşluk içeremez")
    @Pattern(regexp = ".*[A-Z].*", message = "Şifre en az 1 büyük harf içermelidir")
    @Pattern(regexp = ".*[0-9].*", message = "Şifre en az 1 rakam içermelidir")
    private String newPassword;
}