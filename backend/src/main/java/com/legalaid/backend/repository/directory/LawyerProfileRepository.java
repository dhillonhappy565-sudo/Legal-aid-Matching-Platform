package com.legalaid.backend.repository.directory;

import com.legalaid.backend.model.directory.LawyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LawyerProfileRepository extends JpaRepository<LawyerProfile, Long> {
}
