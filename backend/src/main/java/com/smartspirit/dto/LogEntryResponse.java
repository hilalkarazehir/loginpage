package com.smartspirit.dto;

import java.time.LocalDateTime;

public class LogEntryResponse {
    private String username;
    private String action;
    private LocalDateTime createdDate;

    public LogEntryResponse(String username, String action, LocalDateTime createdDate) {
        this.username = username;
        this.action = action;
        this.createdDate = createdDate;
    }

    public String getUsername() { return username; }
    public String getAction() { return action; }
    public LocalDateTime getCreatedDate() { return createdDate; }
}