package com.smarthire.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
    private String skills;
    private Integer experienceYears;
    private String location;
    private String bio;
}
