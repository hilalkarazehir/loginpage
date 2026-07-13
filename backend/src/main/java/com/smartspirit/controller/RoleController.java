package com.smartspirit.controller;

import com.smartspirit.dto.RoleResponse;
import com.smartspirit.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getRoles() {
        List<RoleResponse> roles = roleRepository.findAll()
                .stream()
                .map(role -> new RoleResponse(role.getId(), role.getName()))
                .toList();

        return ResponseEntity.ok(roles);
    }
}