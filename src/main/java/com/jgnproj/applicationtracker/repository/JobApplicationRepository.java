package com.jgnproj.applicationtracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jgnproj.applicationtracker.model.JobApplication;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>{
    // JpaRepository provides standard CRUD operations (save, findById, findAll, deleteById)
    // You can add custom query methods here if needed, e.g., findByCompany(String company)
}
