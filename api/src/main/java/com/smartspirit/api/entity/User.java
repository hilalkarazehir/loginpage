package com.smartspirit.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 16)
    private String username;

    @Column(nullable = false) // bcyrpt ile hash'lenecek
    private String password;

    @Column(length = 32)
    private String firstName;

    @Column(length = 64)
    private String lastName;

    @Column(length = 128)
    private String email;

    @Column(length = 16)
    private String phoneNumber;

    @Column(nullable = false)
    private boolean isActive = true; // active -> isActive yaptık

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private LocalDateTime createdDate = LocalDateTime.now();

    private LocalDateTime updatedDate; // Yeni eklendi (nullable)
}