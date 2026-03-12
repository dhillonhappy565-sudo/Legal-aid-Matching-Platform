package com.legalaid.backend.dto;

public class ProfileUpdateRequest {

    //  private String name;
    // private String username;
    // private String location;
    // private String contactInfo;

    // // LAWYER / NGO only
    // private String organization;
    // private String expertise;

    private String name;
    private String email;
    private String password;

    // getters & setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
