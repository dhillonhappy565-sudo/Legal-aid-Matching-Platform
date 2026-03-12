package com.legalaid.backend.service;

import com.legalaid.backend.dto.CaseMatchesDTO;
import com.legalaid.backend.dto.MatchItemDTO;
import com.legalaid.backend.model.CaseRequest;
import com.legalaid.backend.model.directory.DirectoryProfile;
import com.legalaid.backend.model.directory.LawyerProfile;
import com.legalaid.backend.model.NGOProfile;
import com.legalaid.backend.repository.CaseRepository;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import com.legalaid.backend.repository.directory.LawyerProfileRepository;
import com.legalaid.backend.repository.NGOProfileRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CitizenMatchService {

    private final CaseRepository caseRepo;
    private final DirectoryProfileRepository directoryRepo;
    private final LawyerProfileRepository lawyerRepo;
    private final NGOProfileRepository ngoRepo;

    public CitizenMatchService(
            CaseRepository caseRepo,
            DirectoryProfileRepository directoryRepo,
            LawyerProfileRepository lawyerRepo,
            NGOProfileRepository ngoRepo
    ) {
        this.caseRepo = caseRepo;
        this.directoryRepo = directoryRepo;
        this.lawyerRepo = lawyerRepo;
        this.ngoRepo = ngoRepo;
    }

    public List<CaseMatchesDTO> getMatchesForCitizen(String citizenEmail) {

        List<CaseRequest> cases =
                caseRepo.findByCitizenEmailOrderByCreatedAtDesc(citizenEmail);

        List<DirectoryProfile> directoryProfiles = directoryRepo.findAll();
        List<LawyerProfile> registeredLawyers = lawyerRepo.findAll();
        List<NGOProfile> registeredNgos = ngoRepo.findAll();

        List<CaseMatchesDTO> result = new ArrayList<>();

        for (CaseRequest c : cases) {

            CaseMatchesDTO dto = new CaseMatchesDTO();
            dto.caseId = c.getId();
            dto.caseTitle = c.getTitle();
            dto.caseStatus = c.getStatus();

            List<MatchItemDTO> matches = new ArrayList<>();

            // 1) External Directory Profiles
            for (DirectoryProfile p : directoryProfiles) {
                if (!p.getType().equalsIgnoreCase(c.getTarget())) continue;

                MatchItemDTO m = new MatchItemDTO();
                m.id = p.getExternalId();
                m.name = p.getName();
                m.type = p.getType();
                m.city = p.getState();
                m.specialization = p.getSpecialization();
                m.score = 60;
                matches.add(m);
            }

            // 2) Registered Lawyers
            if (c.getTarget().equalsIgnoreCase("LAWYER")) {
                for (LawyerProfile l : registeredLawyers) {
                    MatchItemDTO m = new MatchItemDTO();
                    m.id = l.getId().toString();
                    m.name = l.getName();
                    m.type = "LAWYER";
                    m.city = l.getState();
                    m.specialization = l.getSpecialization();
                    m.score = 80; // registered higher relevance
                    matches.add(m);
                }
            }

            // 3) Registered NGOs
            if (c.getTarget().equalsIgnoreCase("NGO")) {
                for (NGOProfile n : registeredNgos) {
                    MatchItemDTO m = new MatchItemDTO();
                    m.id = n.getId().toString();
                    m.name = n.getName();
                    m.type = "NGO";
                    m.city = n.getState();
                    m.specialization = "NGO Services";
                    m.score = 80;
                    matches.add(m);
                }
            }

            dto.matches = matches;
            result.add(dto);
        }

        return result;
    }
}
