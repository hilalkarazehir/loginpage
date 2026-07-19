package com.smartspirit.repository;

import com.smartspirit.entity.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface UserLogRepository extends JpaRepository<UserLog, Long> {

    List<UserLog> findTop100ByOrderByCreatedDateDesc();

    long countByUsernameAndActionAndCreatedDateAfter(String username, String action, LocalDateTime after);
}
