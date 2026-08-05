package com.smarthire.service;

import com.smarthire.dto.ApplyRequest;
import com.smarthire.dto.ApplicationResponse;
import com.smarthire.entity.Application;
import com.smarthire.entity.Job;
import com.smarthire.entity.User;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AIService aiService;

    public ApplicationResponse applyToJob(ApplyRequest req, String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Job job = jobRepository.findById(req.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.existsByCandidateAndJob(candidate, job)) {
            throw new RuntimeException("You have already applied to this job!");
        }


        User aiCandidate = candidate;
        if (req.getResumeSkills() != null && !req.getResumeSkills().isBlank()) {

            aiCandidate = User.builder()
                    .skills(req.getResumeSkills())
                    .experienceYears(candidate.getExperienceYears())
                    .build();
        }
        int matchScore = aiService.calculateMatchScore(aiCandidate, job);
        String predictedSalary = aiService.predictSalary(aiCandidate, job);


        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status(Application.ApplicationStatus.APPLIED)
                .matchScore(matchScore)
                .predictedSalary(predictedSalary)
                .coverLetter(req.getCoverLetter())
                .resumeSkills(req.getResumeSkills())
                .resumeFileName(req.getResumeFileName())
                .build();

        return mapToResponse(applicationRepository.save(application));
    }


    public List<ApplicationResponse> getMyApplications(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return applicationRepository.findByCandidate(candidate)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }


    public List<ApplicationResponse> getApplicationsForRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return applicationRepository.findByJobRecruiter(recruiter)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }


    public List<ApplicationResponse> getApplicationsForJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.findByJob(job)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }


    public ApplicationResponse updateStatus(Long appId, String status) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(Application.ApplicationStatus.valueOf(status.toUpperCase()));
        return mapToResponse(applicationRepository.save(app));
    }


    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ApplicationResponse mapToResponse(Application app) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());
        res.setStatus(app.getStatus().name());
        res.setMatchScore(app.getMatchScore());
        res.setPredictedSalary(app.getPredictedSalary());
        res.setCoverLetter(app.getCoverLetter());
        res.setResumeSkills(app.getResumeSkills());
        res.setResumeFileName(app.getResumeFileName());
        res.setAppliedAt(app.getAppliedAt());

        if (app.getJob() != null) {
            res.setJobId(app.getJob().getId());
            res.setJobTitle(app.getJob().getTitle());
            res.setCompany(app.getJob().getCompany());
            res.setJobLocation(app.getJob().getLocation());
        }
        if (app.getCandidate() != null) {
            res.setCandidateId(app.getCandidate().getId());
            res.setCandidateName(app.getCandidate().getName());
            res.setCandidateEmail(app.getCandidate().getEmail());
            res.setCandidateSkills(app.getCandidate().getSkills());
            res.setCandidateExperience(app.getCandidate().getExperienceYears());
        }
        return res;
    }
}
