package com.legalaid.backend.service;

import com.legalaid.backend.dto.RegisterRequest;
import com.legalaid.backend.dto.AuthResponse;
import com.legalaid.backend.dto.LoginRequest;
import com.legalaid.backend.dto.RefreshTokenRequest;
import com.legalaid.backend.model.Role;
import com.legalaid.backend.model.User;
import com.legalaid.backend.repository.UserRepository;
import com.legalaid.backend.security.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.enums.LogStatus;



@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;

        

    public AuthService(
        UserRepository userRepository,
        JwtUtil jwtUtil,
        AuthenticationManager authenticationManager,
        PasswordEncoder passwordEncoder,
        SystemLogService systemLogService  
) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
    this.authenticationManager = authenticationManager;
    this.passwordEncoder = passwordEncoder;
    this.systemLogService = systemLogService; 
}


    // ---------------- REGISTER ----------------
    public void register(RegisterRequest request) {

        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin registration is not allowed");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        boolean verified = request.getRole() == Role.CITIZEN;

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                verified
        );

        userRepository.save(user);
    }
    // ---------------- LOGIN ----------------
public AuthResponse login(LoginRequest request) {

    try {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Block unverified LAWYER / NGO
        if (
            (user.getRole() == Role.LAWYER || user.getRole() == Role.NGO)
            && !user.isVerified()
        ) {
            throw new RuntimeException("Account pending admin approval");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        String accessToken =
                jwtUtil.generateAccessToken(user.getEmail(), claims);

        String refreshToken =
                jwtUtil.generateRefreshToken(user.getEmail());

        // ✅ LOGIN SUCCESS LOG
        systemLogService.log(
                LogCategory.AUTH,
                "User logged in",
                user.getEmail(),
                null,
                LogStatus.SUCCESS,
                null,
                null
        );

        return new AuthResponse(
                accessToken,
                refreshToken,
                user.getRole().name(),
                user.isVerified()
        );

    } catch (Exception ex) {

        // ❌ LOGIN FAILURE LOG
        systemLogService.log(
                LogCategory.AUTH,
                "Login failed",
                request.getEmail(),
                null,
                LogStatus.FAILURE,
                ex.getMessage(),
                null
        );

        throw ex; // VERY IMPORTANT
    }
}


    // ---------------- REFRESH TOKEN ----------------
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        String refreshToken = request.getRefreshToken();

        if (!jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtUtil.extractUsername(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        String newAccessToken =
                jwtUtil.generateAccessToken(email, claims);

                systemLogService.log(
    LogCategory.AUTH,
    "Token refreshed",
    email,
    null,
    LogStatus.SUCCESS,
    null,
    null
);


        return new AuthResponse(
                newAccessToken,
                refreshToken,
                user.getRole().name(),
                user.isVerified()
        );
    }
}
