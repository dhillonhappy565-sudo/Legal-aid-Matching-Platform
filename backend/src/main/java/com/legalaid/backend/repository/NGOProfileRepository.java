package com.legalaid.backend.repository;

import com.legalaid.backend.model.NGOProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NGOProfileRepository extends JpaRepository<NGOProfile, Long> {

    Optional<NGOProfile> findByUserId(String userId);
}
