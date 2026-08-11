package com.smartspirit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequest {

    @NotBlank(message = "Rol adı boş olamaz")
    @Size(max = 50, message = "Rol adı en fazla 50 karakter olabilir")
    private String name;
}
