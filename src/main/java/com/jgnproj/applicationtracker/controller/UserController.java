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
@RequestMapping("/api/auth") // Base path for authentication related endpoints
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
            // In a real application, you might return a JWT token or a simplified user object
            return new ResponseEntity<>("User registered successfully: " + newUser.getEmail(), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // 409 Conflict for existing user
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
                // In a real application, generate and return a JWT token here
                return new ResponseEntity<>("User signed in successfully: " + user.getEmail(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
            }
        }).orElse(new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED));
    }
}