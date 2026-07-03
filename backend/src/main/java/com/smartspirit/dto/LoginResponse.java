package com.smartspirit.dto;

public class LoginResponse {
    private String message;
    private String username;
    private boolean success;
    private String token;

    public LoginResponse(String message, String username, boolean success, String token) {
        this.message = message;
        this.username = username;
        this.success = success;
        this.token = token;
    }

    public String getMessage() { return message; }
    public String getUsername() { return username; }
    public boolean isSuccess() { return success; }
    public String getToken() { return token; }
}