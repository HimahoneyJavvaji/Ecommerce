package com.klu.controller;

import com.klu.config.JwtUtil;
import com.klu.model.User;
import com.klu.payload.*;
import com.klu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ---------------- SIGNUP ----------------
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        // ---------------- ROLE HANDLING ----------------
        String chosenRole = signUpRequest.getRole();
        if (!"ADMIN".equalsIgnoreCase(chosenRole) && !"USER".equalsIgnoreCase(chosenRole)) {
            chosenRole = "USER"; // default
        }
        user.setRole("ROLE_" + chosenRole.toUpperCase());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully with role " + user.getRole());
    }

    // ---------------- LOGIN ----------------
 // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
        String role = user.getRole().replace("ROLE_", "");

        // ✅ Include userId in JWT
        String jwt = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());

        return ResponseEntity.ok(new JwtResponse(jwt, user.getUsername(), user.getRole()));
    }
}
