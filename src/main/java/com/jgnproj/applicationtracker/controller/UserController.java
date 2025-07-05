package com.jgnproj.applicationtracker.controller;

import com.jgnproj.applicationtracker.model.User;
import com.jgnproj.applicationtracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>("Email and password are required", HttpStatus.BAD_REQUEST);
        }

        try {
            User newUser = userService.registerNewUser(email, password);
            // Return user ID upon successful registration for frontend to store
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", newUser.getId());
            response.put("email", newUser.getEmail());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>("Email and password are required", HttpStatus.BAD_REQUEST);
        }

        return userService.findByEmail(email).map(user -> {
            if (userService.checkPassword(password, user.getPasswordHash())) {
                // Return user ID upon successful sign-in for frontend to store
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("message", "User signed in successfully");
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
            }
        }).orElse(new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED));
    }
}