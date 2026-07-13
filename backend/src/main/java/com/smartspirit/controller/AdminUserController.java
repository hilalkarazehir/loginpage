package com.smartspirit.controller;

import com.smartspirit.dto.AdminUserResponse;
import com.smartspirit.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getUsers() {
        List<AdminUserResponse> users = userRepository.findAll()
                .stream()
                .map(u -> new AdminUserResponse(
                        u.getId(),
                        u.getUsername(),
                        (u.getFirstName() + " " + u.getLastName()).trim(),
                        u.getRole() != null ? u.getRole().getName() : null))
                .toList();

        return ResponseEntity.ok(users);
    }
}