package com.smartspirit.entity;

import  jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_logs")
@Getter
@Setter
@NoArgsConstructor
public class UserLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(nullable = false)
    private String action;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    public UserLog(String username, String action, LocalDateTime createdDate) {
        this.username = username;
        this.action = action;
        this.createdDate = createdDate;
    }
}