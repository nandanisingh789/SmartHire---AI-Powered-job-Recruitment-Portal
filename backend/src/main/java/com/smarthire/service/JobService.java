package com.smarthire.service;

import com.smarthire.dto.JobRequest;
import com.smarthire.dto.JobResponse;
import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;

    public JobResponse createJob(JobRequest req, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Job job = Job.builder()
                .title(req.getTitle())
                .company(req.getCompany())
                .location(req.getLocation())
                .description(req.getDescription())
                .requiredSkills(req.getRequiredSkills())
                .minExperience(req.getMinExperience())
                .jobType(req.getJobType())
                .salary(req.getSalary())
                .recruiter(recruiter)
                .status(Job.JobStatus.ACTIVE)
                .build();

        return mapToResponse(jobRepository.save(job));
    }

    public List<JobResponse> getAllActiveJobs() {
        return jobRepository.findByStatus(Job.JobStatus.ACTIVE)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Map<String, Object> getActiveJobsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobPage = jobRepository.findByStatus(Job.JobStatus.ACTIVE, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("jobs", jobPage.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()));
        response.put("currentPage", jobPage.getNumber());
        response.put("totalPages", jobPage.getTotalPages());
        response.put("totalJobs", jobPage.getTotalElements());
        response.put("hasMore", !jobPage.isLast());
        return response;
    }

    public List<JobResponse> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToResponse(job);
    }

    public List<JobResponse> getMyJobs(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByRecruiter(recruiter)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public String closeJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.JobStatus.CLOSED);
        jobRepository.save(job);
        return "Job closed successfully";
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public JobResponse mapToResponse(Job job) {
        JobResponse res = new JobResponse();
        res.setId(job.getId());
        res.setTitle(job.getTitle());
        res.setCompany(job.getCompany());
        res.setLocation(job.getLocation());
        res.setDescription(job.getDescription());
        res.setRequiredSkills(job.getRequiredSkills());
        res.setMinExperience(job.getMinExperience());
        res.setJobType(job.getJobType());
        res.setSalary(job.getSalary());
        res.setStatus(job.getStatus().name());
        res.setCreatedAt(job.getCreatedAt());
        if (job.getRecruiter() != null) {
            res.setRecruiterName(job.getRecruiter().getName());
            res.setRecruiterId(job.getRecruiter().getId());
        }
        return res;
    }
}
