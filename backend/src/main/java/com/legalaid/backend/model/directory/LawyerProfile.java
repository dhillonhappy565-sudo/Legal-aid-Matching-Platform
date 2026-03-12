package com.legalaid.backend.model.directory;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lawyer_directory")
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
public class LawyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String externalId;
    private String name;
    private String state;

    @Column(nullable = true)
    private String specialization;
public Long getId() { return id; }
    public String getExternalId() { return externalId; }
    public String getName() { return name; }
    public String getState() { return state; }
    public String getSpecialization() { return specialization; }

    // ===== SETTERS =====
    public void setId(Long id) { this.id = id; }
    public void setExternalId(String externalId) { this.externalId = externalId; }
    public void setName(String name) { this.name = name; }
    public void setState(String state) { this.state = state; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
