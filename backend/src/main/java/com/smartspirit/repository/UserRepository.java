package com.smartspirit.repository;

import com.smartspirit.entity.Role;
import com.smartspirit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    // Bir rol silinmeden önce o role sahip kullanıcı var mı diye kontrol etmek için.
    long countByRole(Role role);
}