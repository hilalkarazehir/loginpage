package com.smartspirit.dto;
import lombok.Getter;

@Getter
public class RoleResponse {
    private Long id;
    private String name;

    public RoleResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}