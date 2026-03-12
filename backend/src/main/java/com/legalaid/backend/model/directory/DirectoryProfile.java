package com.legalaid.backend.model.directory;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "directory_profile")
public class DirectoryProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String externalId;        // NGO Darpan ID
    private String name;
    private String type;             // NGO / LAWYER
    private String contactPerson;
    private String email;
    private String phone;
    private String state;
    private String district;
    private String address;

    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(name = "specialization")
private String specialization;

    // Generate Getters/Setters
    public String getExternalId() { return externalId; }
public void setExternalId(String externalId) { this.externalId = externalId; }

public String getName() { return name; }
public void setName(String name) { this.name = name; }

public String getType() { return type; }
public void setType(String type) { this.type = type; }

public String getEmail() { return email; }
public void setEmail(String email) { this.email = email; }

public String getState() { return state; }
public void setState(String state) { this.state = state; }

public String getDistrict() { return district; }
public void setDistrict(String district) { this.district = district; }

public String getSpecialization() { return specialization; }
public void setSpecialization(String specialization) { this.specialization = specialization; }

}
