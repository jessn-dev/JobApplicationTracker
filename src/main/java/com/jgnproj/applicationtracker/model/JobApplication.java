package com.jgnproj.applicationtracker.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import java.time.LocalDate;

// Lombok annotations for boilerplate code (add Lombok dependency)
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data // Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor // Generates a no-argument constructor
@AllArgsConstructor // Generates a constructor with all fields
public class JobApplication {

    @Id
    @GeneratedValue
    private Long id;
    private String companyName;
    private String position;
    private String status; // e.g., Applied, Interviewing, Offer, Rejected
    private LocalDate dateApplied;
    private String notes; //optional this is where you can add notes on the job application

    // Custom constructor for easier creation without ID (for new applications)
    public JobApplication(String companyName, String position, String status, LocalDate dateApplied, String notes){
        this.companyName = companyName;
        this.position = position;
        this.status = status;
        this.dateApplied = dateApplied;
        this.notes = notes;
    }
}
