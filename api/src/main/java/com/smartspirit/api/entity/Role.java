package com.smartspirit.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles") // PostgreSQL'de tablonun adı "roles" olacak
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 1, 2, 3 diye otomatik artan ID (Primary Key)
    private Long id;

    @Column(nullable = false, unique = true) // Boş geçilemez ve sistemde aynı isimde iki rol olamaz
    private String name;
}