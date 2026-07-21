package com.smartspirit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    @Pattern(regexp = "^\\S{1,15}$", message = "Kullanıcı adı en fazla 15 karakter olmalı ve boşluk içermemelidir")
    private String username;

    @NotBlank(message = "Şifre boş olamaz")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[0-9])\\S{8,15}$",
            message = "Şifre 8-15 karakter arasında olmalı, boşluk içermemeli, en az 1 büyük harf ve 1 rakam içermelidir"
    )
    private String password;
}