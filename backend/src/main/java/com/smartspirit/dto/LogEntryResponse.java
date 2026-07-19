package com.smartspirit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class LogEntryResponse {

    private final String username;
    private final String action;
    private final LocalDateTime createdDate;

}