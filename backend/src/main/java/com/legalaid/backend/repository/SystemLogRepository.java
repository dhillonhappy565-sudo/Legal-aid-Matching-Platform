package com.legalaid.backend.repository;

import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.model.SystemLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    Page<SystemLog> findByCategory(LogCategory category, Pageable pageable);

    Page<SystemLog>
    findByActorEmailContainingIgnoreCaseOrTargetEmailContainingIgnoreCase(
        String actor,
        String target,
        Pageable pageable
    );
}
