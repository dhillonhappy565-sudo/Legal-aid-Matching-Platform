package com.legalaid.backend.dto;

import java.util.List;

public class NGOProfileRequest {

    private String name;
    private String registrationId;
    private String type;
    private String city;
    private String state;

    private List<String> focusAreas;
    private List<String> services;
    private List<String> modes;
    private List<String> languages;

    // ---- GETTERS & SETTERS ----
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

    public List<String> getFocusAreas() { return focusAreas; }
    public void setFocusAreas(List<String> focusAreas) { this.focusAreas = focusAreas; }

    public List<String> getServices() { return services; }
    public void setServices(List<String> services) { this.services = services; }

    public List<String> getModes() { return modes; }
    public void setModes(List<String> modes) { this.modes = modes; }

    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
}
