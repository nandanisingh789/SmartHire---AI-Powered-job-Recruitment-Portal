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
    private String requiredSkills; // comma separated e.g. "Java,Spring Boot,MySQL"

    @Column
    private Integer minExperience;

    @Column(length = 50)
    private String jobType; // Full-time, Part-time, Remote

    @Column(length = 50)
    private String salary; // e.g. "6-10 LPA"

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

    // Helper: get required skills as list
    public List<String> getRequiredSkillList() {
        if (requiredSkills == null || requiredSkills.isEmpty()) return List.of();
        return Arrays.asList(requiredSkills.toLowerCase().split(","));
    }
}
