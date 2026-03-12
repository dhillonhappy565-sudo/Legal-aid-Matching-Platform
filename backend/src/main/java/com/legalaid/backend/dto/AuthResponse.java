package com.legalaid.backend.dto;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String role;
    private boolean verified;

    public AuthResponse(String accessToken, String refreshToken, String role, boolean verified) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.verified = verified;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getRole() {
        return role;
    }

    public boolean isVerified() {
        return verified;
    }
}
