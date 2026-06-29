package com.smartspirit.api.dto;

public class LoginResponse {
    private String message;
    private String username;
    private boolean success;

    public LoginResponse(String message, String username, boolean success) {
        this.message = message;
        this.username = username;
        this.success = success;
    }

    public String getMessage() { return message; }
    public String getUsername() { return username; }
    public boolean isSuccess() { return success; }
}