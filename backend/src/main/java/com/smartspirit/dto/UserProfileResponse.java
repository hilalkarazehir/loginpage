package com.smartspirit.dto;

public class UserProfileResponse {
    private String username;
    private String message;

    public UserProfileResponse(String username, String message) {
        this.username = username;
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public String getMessage() {
        return message;
    }
}