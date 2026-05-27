package com.hms.microservices.auth.service;

import com.hms.microservices.auth.dto.AuthRequest;
import com.hms.microservices.auth.dto.AuthResponse;
import com.hms.microservices.auth.entity.Role;
import com.hms.microservices.auth.entity.User;
import com.hms.microservices.auth.repository.UserRepository;
import com.hms.microservices.auth.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null ? Role.PATIENT : request.getRole());
        userRepository.save(user);

        String token = jwtService.generateToken(
                user.getUsername(),
                Map.of("role", user.getRole().name())
        );
        return new AuthResponse(token, "User registered successfully");
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String token = jwtService.generateToken(
                user.getUsername(),
                Map.of("role", user.getRole().name())
        );
        return new AuthResponse(token, "Login successful");
    }
}
