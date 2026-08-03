package com.smartspirit.dto;

import lombok.Getter;

@Getter
public class LeaderboardEntryResponse {

    private final String username;
    private final Integer score;

    public LeaderboardEntryResponse(String username, Integer score) {
        this.username = username;
        this.score = score;
    }
}