package com.smartspirit.controller;

import com.smartspirit.dto.ErrorResponse;
import com.smartspirit.dto.RoleRequest;
import com.smartspirit.dto.RoleResponse;
import com.smartspirit.entity.Role;
import com.smartspirit.entity.UserLog;
import com.smartspirit.repository.RoleRepository;
import com.smartspirit.repository.UserLogRepository;
import com.smartspirit.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserLogRepository userLogRepository;

    public RoleController(RoleRepository roleRepository,
                          UserRepository userRepository,
                          UserLogRepository userLogRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getRoles() {
        List<RoleResponse> roles = roleRepository.findAll()
                .stream()
                .map(role -> new RoleResponse(role.getId(), role.getName()))
                .toList();

        return ResponseEntity.ok(roles);
    }

    @PostMapping
    public ResponseEntity<?> createRole(@Valid @RequestBody RoleRequest req,
                                        Authentication authentication,
                                        HttpServletRequest request) {

        String name = req.getName().trim();

        if (roleRepository.findByName(name).isPresent()) {
            return conflict("Bu isimde bir rol zaten var.", request);
        }

        Role role = new Role();
        role.setName(name);
        roleRepository.save(role);
        logAction(authentication, "ROLE_CREATED: " + role.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(new RoleResponse(role.getId(), role.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable Long id,
                                        @Valid @RequestBody RoleRequest req,
                                        Authentication authentication,
                                        HttpServletRequest request) {

        Role role = roleRepository.findById(id).orElse(null);
        if (role == null) {
            return notFound("Rol bulunamadı.", request);
        }

        String newName = req.getName().trim();

        boolean nameTakenByAnotherRole = roleRepository.findByName(newName)
                .map(existing -> !existing.getId().equals(id))
                .orElse(false);

        if (nameTakenByAnotherRole) {
            return conflict("Bu isimde bir rol zaten var.", request);
        }

        String oldName = role.getName();
        role.setName(newName);
        roleRepository.save(role);
        logAction(authentication, "ROLE_UPDATED: " + oldName + " -> " + newName);

        return ResponseEntity.ok(new RoleResponse(role.getId(), role.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id,
                                        Authentication authentication,
                                        HttpServletRequest request) {

        Role role = roleRepository.findById(id).orElse(null);
        if (role == null) {
            return notFound("Rol bulunamadı.", request);
        }

        long usersWithRole = userRepository.countByRole(role);
        if (usersWithRole > 0) {
            return conflict("Bu role sahip " + usersWithRole + " kullanıcı var. Önce onları başka bir role taşıyın.", request);
        }

        roleRepository.delete(role);
        logAction(authentication, "ROLE_DELETED: " + role.getName());

        return ResponseEntity.noContent().build();
    }

    private void logAction(Authentication authentication, String action) {
        String actor = authentication != null ? authentication.getName() : "system";
        userLogRepository.save(new UserLog(actor, action, LocalDateTime.now()));
    }

    private ResponseEntity<ErrorResponse> notFound(String message, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Not Found", message, request.getRequestURI()));
    }

    private ResponseEntity<ErrorResponse> conflict(String message, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(HttpStatus.CONFLICT.value(), "Conflict", message, request.getRequestURI()));
    }
}
