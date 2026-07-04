package com.smartspirit.repository;

import com.smartspirit.entity.SystemError;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemErrorRepository extends JpaRepository<SystemError, Long> {
}
