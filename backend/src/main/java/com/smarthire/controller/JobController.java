package com.smarthire.controller;

import com.smarthire.dto.JobRequest;
import com.smarthire.dto.JobResponse;
import com.smarthire.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class JobController {

    @Autowired
    private JobService jobService;


    @GetMapping("/all")
    public ResponseEntity<?> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ResponseEntity.ok(jobService.getActiveJobsPaginated(page, size));
    }


    @GetMapping("/search")
    public ResponseEntity<List<JobResponse>> searchJobs(@RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getJob(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.getJobById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/recruiter/post")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> postJob(@RequestBody JobRequest req, Principal principal) {
        try {
            JobResponse res = jobService.createJob(req, principal.getName());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/recruiter/my-jobs")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<JobResponse>> getMyJobs(Principal principal) {
        return ResponseEntity.ok(jobService.getMyJobs(principal.getName()));
    }


    @PutMapping("/recruiter/close/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> closeJob(@PathVariable Long id, Principal principal) {
        try {
            return ResponseEntity.ok(jobService.closeJob(id, principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> adminAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }
}
