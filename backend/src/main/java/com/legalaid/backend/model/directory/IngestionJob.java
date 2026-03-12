package com.legalaid.backend.model.directory;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ingestion_jobs")
public class IngestionJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;           // NGO_DARPAN / BAR_COUNCIL
    private String name;             // "NGO Import Job 1"
    private String createdBy;        // admin email

    @Column(columnDefinition = "TEXT")
    private String mappingJson;      // store mapping future use

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // getters setters
}
