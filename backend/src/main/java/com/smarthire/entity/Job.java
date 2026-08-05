package com.smarthire.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 200)
    private String company;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, length = 500)
    private String requiredSkills;

    @Column
    private Integer minExperience;

    @Column(length = 50)
    private String jobType;

    @Column(length = 50)
    private String salary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null) status = JobStatus.ACTIVE;
    }

    public enum JobStatus {
        ACTIVE, CLOSED
    }


    public List<String> getRequiredSkillList() {
        if (requiredSkills == null || requiredSkills.isEmpty()) return List.of();
        return Arrays.asList(requiredSkills.toLowerCase().split(","));
    }
}
