package com.smarthire.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String jobLocation;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidateSkills;
    private Integer candidateExperience;
    private String status;
    private Integer matchScore;
    private String predictedSalary;
    private String coverLetter;
    private String resumeSkills;
    private String resumeFileName;
    private LocalDateTime appliedAt;
}
