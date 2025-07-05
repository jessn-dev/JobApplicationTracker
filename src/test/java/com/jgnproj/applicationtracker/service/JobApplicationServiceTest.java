package com.jgnproj.applicationtracker.service;

import com.jgnproj.applicationtracker.model.JobApplication;
import com.jgnproj.applicationtracker.repository.JobApplicationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JobApplicationServiceTest {

    @Mock // Mocks the JobApplicationRepository dependency
    private JobApplicationRepository jobApplicationRepository;

    @InjectMocks // Injects the mocked repository into the service
    private JobApplicationService jobApplicationService;

    @BeforeEach
    void setUp() {
        // Initialize Mockito annotations before each test
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllApplications() {
        // Arrange: Define the behavior of the mocked repository
        JobApplication app1 = new JobApplication(1L, "Company A", "Position 1", "Applied", LocalDate.now(), "Notes 1", LocalDateTime.now());
        JobApplication app2 = new JobApplication(2L, "Company B", "Position 2", "Interviewing", LocalDate.now(), "Notes 2", LocalDateTime.now());
        List<JobApplication> applications = Arrays.asList(app1, app2);
        when(jobApplicationRepository.findAll()).thenReturn(applications);

        // Act: Call the service method
        List<JobApplication> result = jobApplicationService.getAllApplications();

        // Assert: Verify the result and that the mocked method was called
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Company A", result.get(0).getCompany());
        verify(jobApplicationRepository, times(1)).findAll(); // Verify findAll was called once
    }

    @Test
    void testGetApplicationByIdFound() {
        // Arrange
        Long id = 1L;
        JobApplication app = new JobApplication(id, "Company A", "Position 1", "Applied", LocalDate.now(), "Notes 1", LocalDateTime.now());
        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(app));

        // Act
        Optional<JobApplication> result = jobApplicationService.getApplicationById(id);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Company A", result.get().getCompany());
        verify(jobApplicationRepository, times(1)).findById(id);
    }

    @Test
    void testGetApplicationByIdNotFound() {
        // Arrange
        Long id = 1L;
        when(jobApplicationRepository.findById(id)).thenReturn(Optional.empty());

        // Act
        Optional<JobApplication> result = jobApplicationService.getApplicationById(id);

        // Assert
        assertFalse(result.isPresent());
        verify(jobApplicationRepository, times(1)).findById(id);
    }

    @Test
    void testCreateApplication() {
        // Arrange
        JobApplication newApp = new JobApplication("Company C", "Position 3", "Wishlist", LocalDate.now(), "New app notes");
        // When save is called with any JobApplication, return the same application (simulating persistence)
        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(invocation -> {
            JobApplication app = invocation.getArgument(0);
            assertNotNull(app.getLastUpdated()); // Ensure lastUpdated is set by service
            return app;
        });

        // Act
        JobApplication createdApp = jobApplicationService.createApplication(newApp);

        // Assert
        assertNotNull(createdApp);
        assertEquals("Company C", createdApp.getCompany());
        assertNotNull(createdApp.getLastUpdated()); // Verify lastUpdated is set
        verify(jobApplicationRepository, times(1)).save(newApp);
    }

    @Test
    void testUpdateApplicationSuccess() {
        // Arrange
        Long id = 1L;
        JobApplication existingApp = new JobApplication(id, "Old Company", "Old Position", "Applied", LocalDate.now(), "Old notes", LocalDateTime.of(2023, 1, 1, 10, 0));
        JobApplication updatedDetails = new JobApplication("New Company", "New Position", "Interviewing", LocalDate.now().plusDays(1), "Updated notes");

        when(jobApplicationRepository.findById(id)).thenReturn(Optional.of(existingApp));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(invocation -> {
            JobApplication app = invocation.getArgument(0);
            assertNotNull(app.getLastUpdated()); // Ensure lastUpdated is updated by service
            return app;
        });

        // Act
        JobApplication result = jobApplicationService.updateApplication(id, updatedDetails);

        // Assert
        assertNotNull(result);
        assertEquals("New Company", result.getCompany());
        assertEquals("New Position", result.getPosition());
        assertEquals("Interviewing", result.getStatus());
        assertNotNull(result.getLastUpdated()); // Verify lastUpdated is updated
        assertTrue(result.getLastUpdated().isAfter(LocalDateTime.of(2023, 1, 1, 10, 0))); // Ensure it's a new timestamp
        verify(jobApplicationRepository, times(1)).findById(id);
        verify(jobApplicationRepository, times(1)).save(existingApp); // Verify save was called with the modified existingApp
    }

    @Test
    void testUpdateApplicationNotFound() {
        // Arrange
        Long id = 99L;
        JobApplication updatedDetails = new JobApplication("NonExistent", "Pos", "Applied", LocalDate.now(), "Notes");
        when(jobApplicationRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert: Expect a RuntimeException
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            jobApplicationService.updateApplication(id, updatedDetails);
        });
        assertEquals("Job Application not found with id: " + id, thrown.getMessage());
        verify(jobApplicationRepository, times(1)).findById(id);
        verify(jobApplicationRepository, never()).save(any(JobApplication.class)); // Ensure save was NOT called
    }

    @Test
    void testDeleteApplicationSuccess() {
        // Arrange
        Long id = 1L;
        when(jobApplicationRepository.existsById(id)).thenReturn(true);
        doNothing().when(jobApplicationRepository).deleteById(id); // Mock void method

        // Act
        jobApplicationService.deleteApplication(id);

        // Assert
        verify(jobApplicationRepository, times(1)).existsById(id);
        verify(jobApplicationRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteApplicationNotFound() {
        // Arrange
        Long id = 99L;
        when(jobApplicationRepository.existsById(id)).thenReturn(false);

        // Act & Assert
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            jobApplicationService.deleteApplication(id);
        });
        assertEquals("Job Application not found with id: " + id, thrown.getMessage());
        verify(jobApplicationRepository, times(1)).existsById(id);
        verify(jobApplicationRepository, never()).deleteById(anyLong()); // Ensure delete was NOT called
    }
}
