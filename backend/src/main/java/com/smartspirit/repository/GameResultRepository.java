package com.smartspirit.repository;

import com.smartspirit.dto.LeaderboardEntryResponse;
import com.smartspirit.entity.GameResult;
import com.smartspirit.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GameResultRepository extends JpaRepository<GameResult, Long> {

    @Query("SELECT new com.smartspirit.dto.LeaderboardEntryResponse(g.user.username, MAX(g.score)) " +
            "FROM GameResult g GROUP BY g.user.username ORDER BY MAX(g.score) DESC")
    List<LeaderboardEntryResponse> findLeaderboard(Pageable pageable);

    @Query("SELECT MAX(g.score) FROM GameResult g WHERE g.user = :user")
    Optional<Integer> findMaxScoreByUser(@Param("user") User user);
}