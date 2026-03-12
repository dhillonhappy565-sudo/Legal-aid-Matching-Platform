package com.legalaid.backend.model;

import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.enums.LogStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_logs")
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private LogCategory category;

    private String action;
    private String actorEmail;
    private String targetEmail;

    @Enumerated(EnumType.STRING)
    private LogStatus status;

    @Column(length = 1000)
    private String metadata;

    @Column(nullable = true)
private Long targetId;


    public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public LocalDateTime getTimestamp() {
    return timestamp;
}

public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
}

public LogCategory getCategory() {
    return category;
}

public void setCategory(LogCategory category) {
    this.category = category;
}

public String getAction() {
    return action;
}

public void setAction(String action) {
    this.action = action;
}

public String getActorEmail() {
    return actorEmail;
}

public void setActorEmail(String actorEmail) {
    this.actorEmail = actorEmail;
}

public String getTargetEmail() {
    return targetEmail;
}

public void setTargetEmail(String targetEmail) {
    this.targetEmail = targetEmail;
}

public LogStatus getStatus() {
    return status;
}

public void setStatus(LogStatus status) {
    this.status = status;
}

public String getMetadata() {
    return metadata;
}

public void setMetadata(String metadata) {
    this.metadata = metadata;
}

public Long getTargetId() { return targetId; }
public void setTargetId(Long targetId) { this.targetId = targetId; }


}
