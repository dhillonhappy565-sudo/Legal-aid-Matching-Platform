package com.legalaid.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ngo_profiles")
public class NGOProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String name;
    private String registrationId;
    private String type;
    private String city;
    private String state;

    @Column(columnDefinition = "TEXT")
    private String focusAreas;

    @Column(columnDefinition = "TEXT")
    private String services;

    @Column(columnDefinition = "TEXT")
    private String modes;

    @Column(columnDefinition = "TEXT")
    private String languages;

    // ---- GETTERS & SETTERS ----

    public Long getId() { return id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getFocusAreas() { return focusAreas; }
    public void setFocusAreas(String focusAreas) { this.focusAreas = focusAreas; }

    public String getServices() { return services; }
    public void setServices(String services) { this.services = services; }

    public String getModes() { return modes; }
    public void setModes(String modes) { this.modes = modes; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }
}
