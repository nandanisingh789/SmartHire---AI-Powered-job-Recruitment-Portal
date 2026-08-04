package com.smarthire.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    // AI Match Score (0-100)
    @Column
    private Integer matchScore;

    // AI Predicted Salary
    @Column(length = 50)
    private String predictedSalary;

    @Column(length = 1000)
    private String coverLetter;

    // Resume uploaded skills (candidate can edit before submitting)
    @Column(length = 500)
    private String resumeSkills;

    // Resume file name (stored for display)
    @Column(length = 200)
    private String resumeFileName;

    @Column(updatable = false)
    private LocalDateTime appliedAt;

    @PrePersist
    public void prePersist() {
        appliedAt = LocalDateTime.now();
        if (status == null) status = ApplicationStatus.APPLIED;
    }

    public enum ApplicationStatus {
        APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED, HIRED
    }
}
