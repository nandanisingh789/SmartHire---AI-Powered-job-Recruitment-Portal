package com.smarthire.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String description;
    private String requiredSkills;
    private Integer minExperience;
    private String jobType;
    private String salary;
    private String status;
    private String recruiterName;
    private Long recruiterId;
    private LocalDateTime createdAt;
}
