package com.jgnproj.applicationtracker.controller;

import com.jgnproj.applicationtracker.model.JobApplication;
import com.jgnproj.applicationtracker.service.JobApplicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule; // For LocalDate serialization
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.Arrays;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobApplicationController.class) // Focuses on testing the web layer
class JobApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc; // Used to simulate HTTP requests

    @MockBean // Mocks the service layer, preventing actual database calls
    private JobApplicationService jobApplicationService;

    private ObjectMapper objectMapper; // For converting Java objects to JSON and vice-versa

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Register module for LocalDate and LocalDateTime
    }

    @Test
    void testGetAllApplications() throws Exception {
        JobApplication app1 = new JobApplication(1L, "Company A", "Position 1", "Applied", LocalDate.now(), "Notes 1", LocalDateTime.now());
        JobApplication app2 = new JobApplication(2L, "Company B", "Position 2", "Interviewing", LocalDate.now(), "Notes 2", LocalDateTime.now());
        when(jobApplicationService.getAllApplications()).thenReturn(Arrays.asList(app1, app2));

        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isOk()) // Expect HTTP 200 OK
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2))) // Expect an array of size 2
                .andExpect(jsonPath("$[0].company", is("Company A")));
    }

    @Test
    void testGetApplicationByIdFound() throws Exception {
        Long id = 1L;
        JobApplication app = new JobApplication(id, "Company A", "Position 1", "Applied", LocalDate.now(), "Notes 1", LocalDateTime.now());
        when(jobApplicationService.getApplicationById(id)).thenReturn(Optional.of(app));

        mockMvc.perform(get("/api/applications/{id}", id))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(id.intValue())))
                .andExpect(jsonPath("$.company", is("Company A")));
    }

    @Test
    void testGetApplicationByIdNotFound() throws Exception {
        Long id = 99L;
        when(jobApplicationService.getApplicationById(id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/applications/{id}", id))
                .andExpect(status().isNotFound()); // Expect HTTP 404 Not Found
    }

    @Test
    void testCreateApplication() throws Exception {
        JobApplication newApp = new JobApplication("Company C", "Position 3", "Wishlist", LocalDate.now(), "New app notes");
        // When service creates, it will set the ID and lastUpdated timestamp
        JobApplication savedApp = new JobApplication(3L, "Company C", "Position 3", "Wishlist", LocalDate.now(), "New app notes", LocalDateTime.now());
        when(jobApplicationService.createApplication(any(JobApplication.class))).thenReturn(savedApp);

        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newApp))) // Convert Java object to JSON string
                .andExpect(status().isCreated()) // Expect HTTP 201 Created
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.company", is("Company C")))
                .andExpect(jsonPath("$.lastUpdated").exists()); // Verify lastUpdated field exists
    }

    @Test
    void testUpdateApplicationSuccess() throws Exception {
        Long id = 1L;
        JobApplication updatedDetails = new JobApplication("Updated Co", "Updated Pos", "Interviewing", LocalDate.now().plusDays(1), "Updated notes");
        // Mock the service to return an updated entity with a new lastUpdated timestamp
        JobApplication updatedAppWithTimestamp = new JobApplication(id, "Updated Co", "Updated Pos", "Interviewing", LocalDate.now().plusDays(1), "Updated notes", LocalDateTime.now());

        // Mock findById to return an existing application
        when(jobApplicationService.getApplicationById(id)).thenReturn(Optional.of(new JobApplication(id, "Old Co", "Old Pos", "Applied", LocalDate.now(), "Old notes", LocalDateTime.now().minusDays(1))));
        // Mock updateApplication to return the updated entity
        when(jobApplicationService.updateApplication(eq(id), any(JobApplication.class))).thenReturn(updatedAppWithTimestamp);


        mockMvc.perform(put("/api/applications/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isOk()) // Expect HTTP 200 OK
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.company", is("Updated Co")))
                .andExpect(jsonPath("$.position", is("Updated Pos")))
                .andExpect(jsonPath("$.lastUpdated").exists()); // Verify lastUpdated field exists
    }

    @Test
    void testUpdateApplicationNotFound() throws Exception {
        Long id = 99L;
        JobApplication updatedDetails = new JobApplication("NonExistent", "Pos", "Applied", LocalDate.now(), "Notes");
        // Mock the service to throw RuntimeException when not found
        doThrow(new RuntimeException("Job Application not found with id: " + id))
                .when(jobApplicationService).updateApplication(eq(id), any(JobApplication.class));

        mockMvc.perform(put("/api/applications/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDetails)))
                .andExpect(status().isNotFound()); // Expect HTTP 404 Not Found
    }

    @Test
    void testDeleteApplicationSuccess() throws Exception {
        Long id = 1L;
        // Mock the service's delete method to do nothing (successful deletion)
        doNothing().when(jobApplicationService).deleteApplication(id);

        mockMvc.perform(delete("/api/applications/{id}", id))
                .andExpect(status().isNoContent()); // Expect HTTP 204 No Content
    }

    @Test
    void testDeleteApplicationNotFound() throws Exception {
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

    // Note: Direct unit testing of CORS headers in MockMvc is limited.
    // MockMvc primarily tests the controller's logic, not the full servlet filter chain.
    // The @WebMvcTest annotation usually sets up basic CORS handling.
    // For full CORS testing, you'd perform integration tests or manual checks.
    @Test
    void testCorsHeadersOnGet() throws Exception {
        // This test primarily checks if the controller methods are accessible
        // and if basic headers are present. Full CORS validation is done externally.
        mockMvc.perform(get("/api/applications")
                        .header("Origin", "http://localhost:3000") // Simulate origin header
                        .header("Access-Control-Request-Method", "GET") // Simulate preflight method
                        .header("Access-Control-Request-Headers", "Content-Type")) // Simulate preflight headers
                .andExpect(status().isOk())
                // Verify that the CORS headers are present in the response
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"))
                .andExpect(header().string("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"))
                .andExpect(header().string("Access-Control-Allow-Headers", "*"));
    }

    @Test
    void testCorsPreflightForPost() throws Exception {
        // This test simulates the OPTIONS preflight request.
        // Spring's CORS configuration should handle this automatically.
        mockMvc.perform(options("/api/applications")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk()) // Expect 200 OK for preflight
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"))
                .andExpect(header().string("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"))
                .andExpect(header().string("Access-Control-Allow-Headers", "*"))
                .andExpect(header().exists("Access-Control-Max-Age")); // Max-Age is common for preflight
    }
}