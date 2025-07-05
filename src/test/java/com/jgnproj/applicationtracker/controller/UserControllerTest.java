package com.jgnproj.applicationtracker.controller;

import com.jgnproj.applicationtracker.model.User;
import com.jgnproj.applicationtracker.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void testRegisterUserSuccess() throws Exception {
        String email = "newuser@example.com";
        String password = "password123";
        User newUser = new User(1L, email, "hashedPassword");

        when(userService.registerNewUser(email, password)).thenReturn(newUser);

        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("password", password);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated()) // Expect HTTP 201 Created
                .andExpect(content().string("User registered successfully: " + email));
    }

    @Test
    void testRegisterUserEmailExists() throws Exception {
        String email = "existing@example.com";
        String password = "password123";

        when(userService.registerNewUser(email, password))
                .thenThrow(new RuntimeException("User with this email already exists: " + email));

        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("password", password);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isConflict()) // Expect HTTP 409 Conflict
                .andExpect(content().string("User with this email already exists: " + email));
    }

    @Test
    void testRegisterUserMissingCredentials() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "test@example.com"); // Missing password

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest()) // Expect HTTP 400 Bad Request
                .andExpect(content().string("Email and password are required"));
    }

    @Test
    void testSignInUserSuccess() throws Exception {
        String email = "user@example.com";
        String password = "correctPassword";
        User user = new User(1L, email, "hashedPassword");

        when(userService.findByEmail(email)).thenReturn(Optional.of(user));
        when(userService.checkPassword(password, user.getPasswordHash())).thenReturn(true);

        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("password", password);

        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk()) // Expect HTTP 200 OK
                .andExpect(content().string("User signed in successfully: " + email));
    }

    @Test
    void testSignInUserInvalidPassword() throws Exception {
        String email = "user@example.com";
        String password = "wrongPassword";
        User user = new User(1L, email, "hashedPassword");

        when(userService.findByEmail(email)).thenReturn(Optional.of(user));
        when(userService.checkPassword(password, user.getPasswordHash())).thenReturn(false);

        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("password", password);

        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized()) // Expect HTTP 401 Unauthorized
                .andExpect(content().string("Invalid credentials"));
    }

    @Test
    void testSignInUserNotFound() throws Exception {
        String email = "nonexistent@example.com";
        String password = "password123";

        when(userService.findByEmail(email)).thenReturn(Optional.empty());

        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("password", password);

        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isUnauthorized()) // Expect HTTP 401 Unauthorized
                .andExpect(content().string("Invalid credentials"));
    }

    @Test
    void testSignInUserMissingCredentials() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "test@example.com"); // Missing password

        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest()) // Expect HTTP 400 Bad Request
                .andExpect(content().string("Email and password are required"));
    }
}