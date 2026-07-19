package com.smartspirit.dto;
import lombok.Getter;

@Getter
public class UserProfileResponse {
    private String username;
    private String role;
    private String message;

    public UserProfileResponse(String username, String role, String message) {
        this.username = username;
        this.role = role;
        this.message = message;
    }
}