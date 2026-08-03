package com.smartspirit.controller;

import com.smartspirit.dto.GameResultRequest;
import com.smartspirit.dto.LeaderboardEntryResponse;
import com.smartspirit.entity.GameResult;
import com.smartspirit.entity.User;
import com.smartspirit.repository.GameResultRepository;
import com.smartspirit.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game/results")
public class GameResultController {

    private final GameResultRepository gameResultRepository;
    private final UserRepository userRepository;

    public GameResultController(GameResultRepository gameResultRepository, UserRepository userRepository) {
        this.gameResultRepository = gameResultRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveResult(@Valid @RequestBody GameResultRequest request,
                                                          Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Integer previousBest = gameResultRepository.findMaxScoreByUser(user).orElse(null);
        boolean isNewRecord = previousBest == null || request.getScore() > previousBest;

        GameResult result = GameResult.builder()
                .score(request.getScore())
                .playedAt(LocalDateTime.now())
                .user(user)
                .build();

        gameResultRepository.save(result);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "score", request.getScore(),
                "isNewRecord", isNewRecord,
                "previousBest", previousBest == null ? 0 : previousBest
        ));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryResponse>> getLeaderboard() {
        List<LeaderboardEntryResponse> leaderboard = gameResultRepository.findLeaderboard(PageRequest.of(0, 10));
        return ResponseEntity.ok(leaderboard);
    }
}