package com.smarthire.controller;

import com.smarthire.dto.ApplyRequest;
import com.smarthire.dto.ApplicationResponse;
import com.smarthire.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;


    @PostMapping("/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<?> apply(@RequestBody ApplyRequest req, Principal principal) {
        try {
            ApplicationResponse res = applicationService.applyToJob(req, principal.getName());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/my")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<ApplicationResponse>> myApplications(Principal principal) {
        return ResponseEntity.ok(applicationService.getMyApplications(principal.getName()));
    }


    @GetMapping("/recruiter/all")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationResponse>> recruiterApplications(Principal principal) {
        return ResponseEntity.ok(applicationService.getApplicationsForRecruiter(principal.getName()));
    }


    @GetMapping("/recruiter/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationResponse>> jobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }

    @PutMapping("/recruiter/update/{appId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long appId,
                                          @RequestParam String status) {
        try {
            return ResponseEntity.ok(applicationService.updateStatus(appId, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> allApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }
}
