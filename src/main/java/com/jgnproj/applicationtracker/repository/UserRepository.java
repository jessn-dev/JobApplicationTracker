package com.jgnproj.applicationtracker.repository;

import com.jgnproj.applicationtracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query method to find a user by email
    Optional<User> findByEmail(String email);
}