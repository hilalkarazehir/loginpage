package com.smartspirit.repository;

import com.smartspirit.entity.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLogRepository extends JpaRepository<UserLog, Long> {
    List<UserLog> findAllByOrderByCreatedDateDesc();
}