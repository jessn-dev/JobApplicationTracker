package com.jgnproj.applicationtracker.service;


import com.jgnproj.applicationtracker.model.JobApplication;
import com.jgnproj.applicationtracker.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    public List<JobApplication> getAllApplications() {
        // In a real application, this would be filtered by the authenticated user's ID
        return jobApplicationRepository.findAll();
    }

    public Optional<JobApplication> getApplicationById(Long id) {
        return jobApplicationRepository.findById(id);
    }

    public JobApplication createApplication(JobApplication application) {
        application.setLastUpdated(LocalDateTime.now());
        return jobApplicationRepository.save(application);
    }

    public JobApplication updateApplication(Long id, JobApplication applicationDetails) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Application not found with id: " + id));

        application.setCompany(applicationDetails.getCompany());
        application.setPosition(applicationDetails.getPosition());
        application.setStatus(applicationDetails.getStatus());
        application.setDateApplied(applicationDetails.getDateApplied());
        application.setNotes(applicationDetails.getNotes());
        application.setLastUpdated(LocalDateTime.now());
        // Do not update userId here as it should be immutable after creation
        // application.setUserId(applicationDetails.getUserId());

        return jobApplicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        if (!jobApplicationRepository.existsById(id)) {
            throw new RuntimeException("Job Application not found with id: " + id);
        }
        jobApplicationRepository.deleteById(id);
    }
}