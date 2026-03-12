package com.legalaid.backend.service;

import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.enums.LogStatus;
import com.legalaid.backend.model.SystemLog;
import com.legalaid.backend.repository.SystemLogRepository;

import jakarta.persistence.Column;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SystemLogService {

    @Autowired
    private SystemLogRepository repository;

    public void log(
        LogCategory category,
        String action,
        String actorEmail,
        String targetEmail,
        LogStatus status,
        String metadata,
        Long targetId
    ) {
        SystemLog log = new SystemLog();
        log.setTimestamp(LocalDateTime.now());
        log.setCategory(category);
        log.setAction(action);
        log.setActorEmail(actorEmail);
        log.setTargetEmail(targetEmail);
        log.setStatus(status);
        log.setMetadata(metadata);
        log.setTargetId(targetId);
        repository.save(log);
    }
}
