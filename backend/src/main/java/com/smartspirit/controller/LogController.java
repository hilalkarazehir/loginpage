package com.smartspirit.controller;

import com.smartspirit.dto.LogEntryResponse;
import com.smartspirit.repository.UserLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final UserLogRepository userLogRepository;

    public LogController(UserLogRepository userLogRepository) {
        this.userLogRepository = userLogRepository;
    }

    @GetMapping
    public ResponseEntity<List<LogEntryResponse>> getLogs() {
        List<LogEntryResponse> logs = userLogRepository.findAllByOrderByCreatedDateDesc()
                .stream()
                .map(log -> new LogEntryResponse(log.getUsername(), log.getAction(), log.getCreatedDate()))
                .limit(100)
                .toList();

        return ResponseEntity.ok(logs);
    }
}
