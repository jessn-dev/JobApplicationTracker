package com.jgnproj.applicationtracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
//import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
//@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId; // New field to link to a user
    private String company;
    private String position;
    private String status;
    private LocalDate dateApplied;
    private String notes;
    private LocalDateTime lastUpdated;

    // Custom constructor for easier creation without ID (for new applications)
    public JobApplication(Long userId, String company, String position, String status, LocalDate dateApplied, String notes) {
        this.userId = userId;
        this.company = company;
        this.position = position;
        this.status = status;
        this.dateApplied = dateApplied;
        this.notes = notes;
        this.lastUpdated = null; // Will be set by service on creation
    }

    // Constructor including ID and lastUpdated for full object creation
    public JobApplication(Long id, Long userId, String company, String position, String status, LocalDate dateApplied, String notes, LocalDateTime lastUpdated) {
        this.id = id;
        this.userId = userId;
        this.company = company;
        this.position = position;
        this.status = status;
        this.dateApplied = dateApplied;
        this.notes = notes;
        this.lastUpdated = lastUpdated;
    }
}