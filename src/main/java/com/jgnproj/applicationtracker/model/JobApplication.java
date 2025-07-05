package com.jgnproj.applicationtracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Lombok annotations for boilerplate code (add Lombok dependency)
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Generates a no-argument constructor
//@AllArgsConstructor // Generates a constructor with all fields
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String company;
    private String position;
    private String status; // e.g., Applied, Interviewing, Offer, Rejected
    private LocalDate dateApplied;
    private String notes;
    private LocalDateTime lastUpdated;

    // Custom constructor for easier creation without ID (for new applications)
    // Updated to include lastUpdated, though service will set it
    public JobApplication(String company, String position, String status, LocalDate dateApplied, String notes) {
        this.company = company;
        this.position = position;
        this.status = status;
        this.dateApplied = dateApplied;
        this.notes = notes;
        this.lastUpdated = null; // Will be set by service on creation
    }

    // Constructor including ID and lastUpdated for full object creation
    public JobApplication(Long id, String company, String position, String status, LocalDate dateApplied, String notes, LocalDateTime lastUpdated) {
        this.id = id;
        this.company = company;
        this.position = position;
        this.status = status;
        this.dateApplied = dateApplied;
        this.notes = notes;
        this.lastUpdated = lastUpdated;
    }
}


