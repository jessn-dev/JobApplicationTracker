package com.jgnproj.applicationtracker.service;

import com.jgnproj.applicationtracker.model.JobApplication;
import com.jgnproj.applicationtracker.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    // Get all job applications
    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    // Get a job application by ID
    public Optional<JobApplication> getApplicationById(Long id) {
        return jobApplicationRepository.findById(id);
    }

    // Create a new job application
    public JobApplication createApplication(JobApplication application) {
        return jobApplicationRepository.save(application);
    }

    // Update an existing job application
    public JobApplication updateApplication(Long id, JobApplication applicationDetails) {
        // Check if the application exists
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Application not found with id: " + id));

        // Update fields
        application.setCompanyName(applicationDetails.getCompanyName());
        application.setPosition(applicationDetails.getPosition());
        application.setStatus(applicationDetails.getStatus());
        application.setDateApplied(applicationDetails.getDateApplied());
        application.setNotes(applicationDetails.getNotes());

        return jobApplicationRepository.save(application);
    }

    // Delete a job application
    public void deleteApplication(Long id) {
        // Check if the application exists before deleting
        if (!jobApplicationRepository.existsById(id)) {
            throw new RuntimeException("Job Application not found with id: " + id);
        }
        jobApplicationRepository.deleteById(id);
    }
}