package com.smartspirit.dto;

public class LoginResponse {
    private String message;
    private String username;
    private boolean success;
    private String token;
    private String refreshToken;

    public LoginResponse(String message, String username, boolean success, String token) {
        this(message, username, success, token, null);
    }

    public LoginResponse(String message, String username, boolean success, String token, String refreshToken) {
        this.message = message;
        this.username = username;
        this.success = success;
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public String getMessage() { return message; }
    public String getUsername() { return username; }
    public boolean isSuccess() { return success; }
    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
}