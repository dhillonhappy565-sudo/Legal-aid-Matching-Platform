package com.legalaid.backend.repository.directory;

import com.legalaid.backend.model.directory.DirectoryProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DirectoryProfileRepository extends JpaRepository<DirectoryProfile, Long> {
    Optional<DirectoryProfile> findByExternalId(String externalId);
}
