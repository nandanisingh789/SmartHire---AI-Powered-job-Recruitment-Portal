package com.smarthire.config;

import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if no users exist
        if (userRepository.count() > 0) return;

        // Admin
        User admin = User.builder()
                .name("Admin User")
                .email("admin@smarthire.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .location("Delhi")
                .build();

        // Recruiter
        User recruiter = User.builder()
                .name("Rahul Recruiter")
                .email("recruiter@smarthire.com")
                .password(passwordEncoder.encode("recruit123"))
                .role(User.Role.RECRUITER)
                .location("Noida")
                .build();

        // Candidate
        User candidate = User.builder()
                .name("Priya Candidate")
                .email("candidate@smarthire.com")
                .password(passwordEncoder.encode("cand123"))
                .role(User.Role.CANDIDATE)
                .skills("Java,Spring Boot,Hibernate,MySQL,React")
                .experienceYears(3)
                .location("Noida, UP")
                .bio("Passionate Java developer with 3 years of experience.")
                .build();

        userRepository.save(admin);
        userRepository.save(recruiter);
        userRepository.save(candidate);

        // Sample Jobs
        Job job1 = Job.builder()
                .title("Java Backend Developer")
                .company("Nagarro")
                .location("Noida, UP")
                .description("We are looking for an experienced Java Backend Developer to join our team. You will work on building RESTful APIs using Spring Boot and Hibernate.")
                .requiredSkills("Java,Spring Boot,Hibernate,MySQL,REST API")
                .minExperience(2)
                .jobType("Full-time")
                .salary("8-14 LPA")
                .recruiter(recruiter)
                .status(Job.JobStatus.ACTIVE)
                .build();

        Job job2 = Job.builder()
                .title("Full Stack Developer")
                .company("HCL Technologies")
                .location("Noida, UP")
                .description("Exciting opportunity for a Full Stack Developer with hands-on experience in Java Spring Boot backend and React frontend.")
                .requiredSkills("Java,Spring Boot,React,MySQL,REST API,HTML,CSS")
                .minExperience(3)
                .jobType("Full-time")
                .salary("10-18 LPA")
                .recruiter(recruiter)
                .status(Job.JobStatus.ACTIVE)
                .build();

        Job job3 = Job.builder()
                .title("React Frontend Developer")
                .company("Persistent Systems")
                .location("Remote")
                .description("Looking for a creative React developer to build stunning user interfaces for our enterprise applications.")
                .requiredSkills("React,JavaScript,HTML,CSS,REST API")
                .minExperience(1)
                .jobType("Remote")
                .salary("6-10 LPA")
                .recruiter(recruiter)
                .status(Job.JobStatus.ACTIVE)
                .build();

        jobRepository.save(job1);
        jobRepository.save(job2);
        jobRepository.save(job3);

        // More realistic jobs
        Job job4 = Job.builder().title("Senior Java Developer").company("TCS").location("Noida, UP")
                .description("Senior Java developer for large-scale enterprise applications using Spring Boot microservices.")
                .requiredSkills("Java,Spring Boot,Microservices,MySQL,REST API,Hibernate")
                .minExperience(4).jobType("Full-time").salary("12-18 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job5 = Job.builder().title("Full Stack Developer").company("Wipro").location("Noida, UP")
                .description("Full stack developer with React frontend and Spring Boot backend for SaaS products.")
                .requiredSkills("Java,Spring Boot,React,MySQL,HTML,CSS,JavaScript")
                .minExperience(2).jobType("Full-time").salary("8-14 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job6 = Job.builder().title("Software Engineer").company("Tech Mahindra").location("Noida, UP")
                .description("Software engineer for Java-based enterprise solutions and REST API development.")
                .requiredSkills("Java,Spring Boot,MySQL,REST API,Git")
                .minExperience(1).jobType("Full-time").salary("5-8 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job7 = Job.builder().title("React Frontend Developer").company("Infosys BPM").location("Remote")
                .description("React developer for building modern SPAs with REST API integration.")
                .requiredSkills("React,JavaScript,HTML,CSS,REST API,Git")
                .minExperience(1).jobType("Remote").salary("6-10 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job8 = Job.builder().title("Associate Software Engineer").company("Accenture").location("Noida, UP")
                .description("Entry level Java developer for Spring Boot projects. Freshers with good Java knowledge can apply.")
                .requiredSkills("Java,Spring Boot,MySQL,HTML,CSS")
                .minExperience(0).jobType("Full-time").salary("4-6 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job9 = Job.builder().title("Backend Engineer").company("Mphasis").location("Noida, UP")
                .description("Backend engineer for REST API and microservices development using Spring Boot.")
                .requiredSkills("Java,Spring Boot,Hibernate,MySQL,REST API")
                .minExperience(2).jobType("Full-time").salary("7-12 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job10 = Job.builder().title("Java Full Stack Lead").company("Cognizant").location("Noida, UP")
                .description("Team lead role for full stack Java development with React frontend.")
                .requiredSkills("Java,Spring Boot,React,MySQL,Hibernate,REST API,JavaScript")
                .minExperience(5).jobType("Full-time").salary("16-24 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job11 = Job.builder().title("Spring Boot Developer").company("Capgemini").location("Noida, UP")
                .description("Spring Boot developer for backend API development and database design.")
                .requiredSkills("Java,Spring Boot,Hibernate,MySQL,REST API")
                .minExperience(2).jobType("Full-time").salary("7-11 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        Job job12 = Job.builder().title("JavaScript Developer").company("GlobalLogic").location("Remote")
                .description("JavaScript developer with React and Node.js experience for product development.")
                .requiredSkills("JavaScript,React,HTML,CSS,REST API")
                .minExperience(1).jobType("Remote").salary("6-9 LPA")
                .recruiter(recruiter).status(Job.JobStatus.ACTIVE).build();

        jobRepository.save(job4);
        jobRepository.save(job5);
        jobRepository.save(job6);
        jobRepository.save(job7);
        jobRepository.save(job8);
        jobRepository.save(job9);
        jobRepository.save(job10);
        jobRepository.save(job11);
        jobRepository.save(job12);

        System.out.println("✅ Demo data seeded successfully!");
        System.out.println("   Admin:     admin@smarthire.com / admin123");
        System.out.println("   Recruiter: recruiter@smarthire.com / recruit123");
        System.out.println("   Candidate: candidate@smarthire.com / cand123");
    }
}
