package com.legalaid.backend.service;

import com.legalaid.backend.dto.AnalyticsOverviewDTO;
import com.legalaid.backend.repository.UserRepository;
import com.legalaid.backend.repository.CaseRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private final UserRepository userRepo;
    private final CaseRepository caseRepo;

    public AnalyticsService(UserRepository userRepo,
                             CaseRepository caseRepo) {
        this.userRepo = userRepo;
        this.caseRepo = caseRepo;
    }

    public AnalyticsOverviewDTO getOverview() {
        AnalyticsOverviewDTO dto = new AnalyticsOverviewDTO();

        dto.totalUsers = userRepo.count();
        dto.totalLawyers = userRepo.countByRole("LAWYER");
        dto.totalNgos = userRepo.countByRole("NGO");

        dto.totalCases = caseRepo.count();
        dto.matchedCases = caseRepo.countByStatus("ASSIGNED");
        dto.resolvedCases = caseRepo.countByStatus("CLOSED");

        return dto;
    }
}
