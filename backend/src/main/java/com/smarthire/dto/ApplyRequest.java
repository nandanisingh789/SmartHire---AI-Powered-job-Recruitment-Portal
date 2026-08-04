package com.smarthire.dto;

import lombok.Data;

@Data
public class ApplyRequest {
    private Long jobId;
    private String coverLetter;
    private String resumeSkills;    // skills parsed/edited from resume
    private String resumeFileName;  // just the file name for display
}
