package com.legalaid.backend.repository.directory;

import com.legalaid.backend.model.directory.IngestionRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngestionRunRepository extends JpaRepository<IngestionRun, Long> {
    List<IngestionRun> findTop5ByOrderByRunAtDesc();
}
