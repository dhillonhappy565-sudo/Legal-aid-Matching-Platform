package com.legalaid.backend.service;

import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.enums.LogStatus;
import com.legalaid.backend.model.CaseRequest;
import com.legalaid.backend.repository.CaseRepository;
import com.legalaid.backend.service.SystemLogService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;



import java.util.List;
import java.util.Optional;


@Service
public class CaseService {

    private final CaseRepository repository;
private final SystemLogService logService;

public CaseService(CaseRepository repository, SystemLogService logService) {
    this.repository = repository;
    this.logService = logService;
}


    // CREATE
public CaseRequest create(CaseRequest request) {
    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    request.setCitizenEmail(email);
    CaseRequest saved = repository.save(request);

    // 🔥 SYSTEM LOG
    logService.log(
        LogCategory.SYSTEM,
        "CASE_CREATED",
        email,
        null,
        LogStatus.SUCCESS,
        "Citizen submitted a case",
        saved.getId()          // <-- THIS MUST EXIST
);




    return saved;
}

public Optional<CaseRequest> findById(Long id) {
    return repository.findById(id);
}


    // FETCH MY CASES
    public List<CaseRequest> getMyCases() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return repository.findByCitizenEmailOrderByCreatedAtDesc(email);
    }

    

    // UPDATE (ONLY IF NOT ASSIGNED)
    public CaseRequest update(Long id, CaseRequest updated) {
        CaseRequest existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!"IN_REVIEW".equals(existing.getStatus())) {
            throw new RuntimeException("Case cannot be edited after assignment");
        }

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        existing.setSubCategory(updated.getSubCategory());
        existing.setUrgency(updated.getUrgency());
        existing.setLocation(updated.getLocation());
        existing.setInvolvedParties(updated.getInvolvedParties());
        existing.setPreferredLanguage(updated.getPreferredLanguage());
        existing.setHelpMode(updated.getHelpMode());
        existing.setAdditionalNotes(updated.getAdditionalNotes());

        return repository.save(existing);
    }

    // DELETE (HARD DELETE)
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
