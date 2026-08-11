package com.smartspirit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    @Size(max = 16, message = "Kullanıcı adı en fazla 16 karakter olabilir")
    private String username;

    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalı")
    private String password;

    @Size(max = 32, message = "Ad en fazla 32 karakter olabilir")
    private String firstName;

    @Size(max = 64, message = "Soyad en fazla 64 karakter olabilir")
    private String lastName;

    @Email(message = "Geçerli bir e-posta adresi girin")
    @Size(max = 128, message = "E-posta en fazla 128 karakter olabilir")
    private String email;

    @Size(max = 16, message = "Telefon numarası en fazla 16 karakter olabilir")
    private String phoneNumber;

    @NotNull(message = "Rol seçilmelidir")
    private Long roleId;
}
