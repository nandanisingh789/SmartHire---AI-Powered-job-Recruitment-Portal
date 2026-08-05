package com.smarthire.dto;

import lombok.Data;

@Data
public class ApplyRequest {
    private Long jobId;
    private String coverLetter;
    private String resumeSkills;
    private String resumeFileName;
}
