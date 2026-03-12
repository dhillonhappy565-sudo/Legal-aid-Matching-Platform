package com.legalaid.backend.model.directory;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "ingestion_runs")
public class IngestionRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;      // NGO_DARPAN / BAR_COUNCIL

    private int imported = 0;
    private int updated = 0;
    private int skipped = 0;

    private String status;      // SUCCESS / FAILED
    private String notes;       // error message if failed

    private LocalDateTime runAt;

    @PrePersist
    void setTime() {
        runAt = LocalDateTime.now();
    }

    public void setSource(String source) { this.source = source; }
public void setImported(int imported) { this.imported = imported; }
public void setUpdated(int updated) { this.updated = updated; }
public void setSkipped(int skipped) { this.skipped = skipped; }
public void setStatus(String status) { this.status = status; }
public void setNotes(String notes) { this.notes = notes; }

}
