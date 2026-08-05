package com.smarthire.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    @Column(length = 500)
    private String skills;

    @Column
    private Integer experienceYears;

    @Column(length = 200)
    private String location;

    @Column(length = 300)
    private String bio;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    public enum Role {
        ADMIN, RECRUITER, CANDIDATE
    }

    public List<String> getSkillList() {
        if (skills == null || skills.isEmpty()) return List.of();
        return Arrays.asList(skills.toLowerCase().split(","));
    }
}
