package com.legalaid.backend.repository;

import com.legalaid.backend.model.CaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseRepository extends JpaRepository<CaseRequest, Long> {

    List<CaseRequest> findByCitizenEmailOrderByCreatedAtDesc(String citizenEmail);
    long countByStatus(String status);

}
