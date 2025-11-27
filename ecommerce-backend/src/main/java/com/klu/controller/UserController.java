package com.klu.controller;

import com.klu.config.JwtUtil;
import com.klu.model.User;
import com.klu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------- GET PROFILE ----------
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String username = jwtUtil.getUsernameFromJwt(token);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User u = userOpt.get();

        return ResponseEntity.ok(new ProfileResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getRole(),
                u.getCreatedAt()
        ));
    }

    // ---------- UPDATE PROFILE ----------
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ProfileUpdateRequest req
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String username = jwtUtil.getUsernameFromJwt(token);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();

        // Check duplicates
        Optional<User> usernameCheck = userRepository.findByUsername(req.username());
        if (usernameCheck.isPresent() && !usernameCheck.get().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }

        Optional<User> emailCheck = userRepository.findByEmail(req.email());
        if (emailCheck.isPresent() && !emailCheck.get().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        // Update fields
        user.setUsername(req.username());
        user.setEmail(req.email());
        userRepository.save(user);

        // Generate new JWT
        String newJwt = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());

        // Return updated profile + new token
        return ResponseEntity.ok(new UpdateProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                newJwt
        ));
    }

    // ---------- CHANGE PASSWORD ----------
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PasswordChangeRequest req
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String username = jwtUtil.getUsernameFromJwt(token);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(req.oldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);

        // Generate new JWT
        String newJwt = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());

        // Return success message + new token
        return ResponseEntity.ok(new ChangePasswordResponse(
                "Password changed successfully!",
                newJwt
        ));
    }

    // ---------- DELETE ACCOUNT ----------
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing token");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String username = jwtUtil.getUsernameFromJwt(token);

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userRepository.delete(userOpt.get());

        return ResponseEntity.ok("Account deleted successfully!");
    }

    // ------------------ DTO RECORDS ------------------
    public static record ProfileUpdateRequest(String username, String email) {}

    public static record PasswordChangeRequest(String oldPassword, String newPassword) {}

    public static record ProfileResponse(Long id, String username, String email, String role, Instant createdAt) {}

    public static record UpdateProfileResponse(
            Long id,
            String username,
            String email,
            String role,
            Instant createdAt,
            String token
    ) {}

    public static record ChangePasswordResponse(String message, String token) {}
}
