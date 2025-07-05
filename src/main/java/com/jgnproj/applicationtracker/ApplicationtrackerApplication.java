package com.jgnproj.applicationtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Import BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder; // Import PasswordEncoder

@SpringBootApplication
public class ApplicationtrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApplicationtrackerApplication.class, args);
	}

	// Configure CORS to allow frontend (React) to connect
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**") // Apply CORS to all /api endpoints
						.allowedOrigins("http://localhost:3000") // Allow requests from React dev server
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}

	// Bean for password encoding
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}