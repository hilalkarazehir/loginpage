package com.smartspirit.api.entity;

import jakarta.persistence.*;
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


    @Column(nullable = false)
    private String action;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;
}