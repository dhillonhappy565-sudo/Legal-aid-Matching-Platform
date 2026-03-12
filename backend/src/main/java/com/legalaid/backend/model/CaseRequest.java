package com.legalaid.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
public class CaseRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String citizenEmail;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String subCategory;

    private String urgency;
    private String location;

    private String involvedParties;
    private String preferredLanguage;
    private String helpMode;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    private String target; // LAWYER / NGO

    private String status; // IN_REVIEW, ASSIGNED, CLOSED

    private String assignedTo;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = "IN_REVIEW";
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    

    // ===== GETTERS =====

public Long getId() {
    return id;
}

public String getCitizenEmail() {
    return citizenEmail;
}

public String getTitle() {
    return title;
}

public String getDescription() {
    return description;
}

public String getCategory() {
    return category;
}

public String getSubCategory() {
    return subCategory;
}

public String getUrgency() {
    return urgency;
}

public String getLocation() {
    return location;
}

public String getInvolvedParties() {
    return involvedParties;
}

public String getPreferredLanguage() {
    return preferredLanguage;
}

public String getHelpMode() {
    return helpMode;
}

public String getAdditionalNotes() {
    return additionalNotes;
}

public String getTarget() {
    return target;
}

public String getStatus() {
    return status;
}

public String getAssignedTo() {
    return assignedTo;
}

public LocalDateTime getCreatedAt() {
    return createdAt;
}

public LocalDateTime getUpdatedAt() {
    return updatedAt;
}


// ===== SETTERS =====

public void setId(Long id) {
    this.id = id;
}

public void setCitizenEmail(String citizenEmail) {
    this.citizenEmail = citizenEmail;
}

public void setTitle(String title) {
    this.title = title;
}

public void setDescription(String description) {
    this.description = description;
}

public void setCategory(String category) {
    this.category = category;
}

public void setSubCategory(String subCategory) {
    this.subCategory = subCategory;
}

public void setUrgency(String urgency) {
    this.urgency = urgency;
}

public void setLocation(String location) {
    this.location = location;
}

public void setInvolvedParties(String involvedParties) {
    this.involvedParties = involvedParties;
}

public void setPreferredLanguage(String preferredLanguage) {
    this.preferredLanguage = preferredLanguage;
}

public void setHelpMode(String helpMode) {
    this.helpMode = helpMode;
}

public void setAdditionalNotes(String additionalNotes) {
    this.additionalNotes = additionalNotes;
}

public void setTarget(String target) {
    this.target = target;
}

public void setStatus(String status) {
    this.status = status;
}

public void setAssignedTo(String assignedTo) {
    this.assignedTo = assignedTo;
}

public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}

public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}

}
