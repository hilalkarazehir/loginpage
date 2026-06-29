package com.smartspirit.api.entity;

import  jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "error_logs")
@Getter
@Setter
@NoArgsConstructor
public class SystemError {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String details;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;
}