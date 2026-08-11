package com.smartspirit.controller;

import com.smartspirit.dto.AdminUserResponse;
import com.smartspirit.dto.CreateUserRequest;
import com.smartspirit.dto.ErrorResponse;
import com.smartspirit.dto.UpdateUserRequest;
import com.smartspirit.entity.Role;
import com.smartspirit.entity.User;
import com.smartspirit.entity.UserLog;
import com.smartspirit.repository.RoleRepository;
import com.smartspirit.repository.UserLogRepository;
import com.smartspirit.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserLogRepository userLogRepository;

    public AdminUserController(UserRepository userRepository,
                               RoleRepository roleRepository,
                               PasswordEncoder passwordEncoder,
                               UserLogRepository userLogRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.userLogRepository = userLogRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getUsers() {
        List<AdminUserResponse> users = userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest req,
                                        Authentication authentication,
                                        HttpServletRequest request) {

        if (userRepository.existsByUsername(req.getUsername())) {
            return conflict("Bu kullanıcı adı zaten kullanılıyor.", request);
        }

        Role role = roleRepository.findById(req.getRoleId()).orElse(null);
        if (role == null) {
            return badRequest("Geçersiz rol seçildi.", request);
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setRole(role);
        user.setCreatedDate(LocalDateTime.now());

        userRepository.save(user);
        logAction(authentication, "USER_CREATED: " + user.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @Valid @RequestBody UpdateUserRequest req,
                                        Authentication authentication,
                                        HttpServletRequest request) {

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return notFound("Kullanıcı bulunamadı.", request);
        }

        Role role = roleRepository.findById(req.getRoleId()).orElse(null);
        if (role == null) {
            return badRequest("Geçersiz rol seçildi.", request);
        }

        boolean isDowngradingLastAdmin = isAdmin(user.getRole()) && !isAdmin(role)
                && userRepository.countByRole(user.getRole()) <= 1;
        if (isDowngradingLastAdmin) {
            return conflict("Sistemde en az bir admin kalmalı; bu son admin hesabının rolü değiştirilemez.", request);
        }

        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setRole(role);
        user.setUpdatedDate(LocalDateTime.now());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            // Şifre reset akışıyla aynı mantık: tokenVersion artırılınca kullanıcının
            // o ana kadar dağıtılmış tüm access/refresh token'ları geçersiz olur.
            user.setTokenVersion(user.getTokenVersion() + 1);
        }

        userRepository.save(user);
        logAction(authentication, "USER_UPDATED: " + user.getUsername());

        return ResponseEntity.ok(toResponse(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,
                                        Authentication authentication,
                                        HttpServletRequest request) {

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return notFound("Kullanıcı bulunamadı.", request);
        }

        if (user.getUsername().equals(authentication.getName())) {
            return badRequest("Kendi hesabınızı silemezsiniz.", request);
        }

        if (isAdmin(user.getRole()) && userRepository.countByRole(user.getRole()) <= 1) {
            return conflict("Sistemde en az bir admin kalmalı; son admin hesabı silinemez.", request);
        }

        userRepository.delete(user);
        logAction(authentication, "USER_DELETED: " + user.getUsername());

        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Role role) {
        return role != null && "ADMIN".equalsIgnoreCase(role.getName());
    }

    private AdminUserResponse toResponse(User u) {
        return new AdminUserResponse(
                u.getId(),
                u.getUsername(),
                (u.getFirstName() + " " + u.getLastName()).trim(),
                u.getRole() != null ? u.getRole().getName() : null,
                u.getRole() != null ? u.getRole().getId() : null,
                u.getFirstName(),
                u.getLastName(),
                u.getEmail(),
                u.getPhoneNumber());
    }

    private void logAction(Authentication authentication, String action) {
        String actor = authentication != null ? authentication.getName() : "system";
        userLogRepository.save(new UserLog(actor, action, LocalDateTime.now()));
    }

    private ResponseEntity<ErrorResponse> badRequest(String message, HttpServletRequest request) {
        return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Bad Request", message, request.getRequestURI()));
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
