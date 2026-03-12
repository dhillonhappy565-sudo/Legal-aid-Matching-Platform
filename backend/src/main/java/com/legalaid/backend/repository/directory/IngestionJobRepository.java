package com.legalaid.backend.repository.directory;

import com.legalaid.backend.model.directory.IngestionJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngestionJobRepository extends JpaRepository<IngestionJob, Long> {}
