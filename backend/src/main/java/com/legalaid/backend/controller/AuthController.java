package com.legalaid.backend.controller;

import com.legalaid.backend.dto.AuthResponse;
import com.legalaid.backend.dto.LoginRequest;
import com.legalaid.backend.dto.RefreshTokenRequest;
import com.legalaid.backend.dto.RegisterRequest;
import com.legalaid.backend.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.enums.LogStatus;
import com.legalaid.backend.service.SystemLogService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;


import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.enums.LogStatus;
import com.legalaid.backend.service.SystemLogService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final SystemLogService systemLogService;

    private final AuthService authService;

    public AuthController(AuthService authService, SystemLogService systemLogService) {
    this.authService = authService;
    this.systemLogService = systemLogService;
}


    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Registration successful. Await admin approval if required.");
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // ---------------- REFRESH TOKEN ----------------
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
public ResponseEntity<String> logout(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestHeader(value = "Authorization", required = false) String authHeader
) {
    String email = "UNKNOWN";

    if (userDetails != null) {
        email = userDetails.getUsername();
    } else if (authHeader != null && authHeader.startsWith("Bearer ")) {
        email = "TOKEN_PRESENT";
    }

    systemLogService.log(
            LogCategory.AUTH,
            "User logged out",
            email,
            null,
            LogStatus.INFO,
            null,
            null
    );

    return ResponseEntity.ok("Logged out successfully");


}


    
}
