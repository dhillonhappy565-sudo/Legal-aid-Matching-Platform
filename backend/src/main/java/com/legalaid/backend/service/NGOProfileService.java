package com.legalaid.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.legalaid.backend.dto.NGOProfileRequest;
import com.legalaid.backend.model.NGOProfile;
import com.legalaid.backend.model.directory.DirectoryProfile;
import com.legalaid.backend.repository.NGOProfileRepository;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class NGOProfileService {

    private final NGOProfileRepository repository;
    private final DirectoryProfileRepository directoryRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public NGOProfileService(NGOProfileRepository repository,
                             DirectoryProfileRepository directoryRepo) {
        this.repository = repository;
        this.directoryRepo = directoryRepo;
    }

    public NGOProfile saveOrUpdate(String userId, NGOProfileRequest req) {

        NGOProfile profile = repository.findByUserId(userId)
                .orElse(new NGOProfile());

        profile.setUserId(userId);
        profile.setName(req.getName());
        profile.setRegistrationId(req.getRegistrationId());
        profile.setType(req.getType());
        profile.setCity(req.getCity());
        profile.setState(req.getState());

        try {
            profile.setFocusAreas(req.getFocusAreas() != null ?
                    mapper.writeValueAsString(req.getFocusAreas()) : null);
            profile.setServices(req.getServices() != null ?
                    mapper.writeValueAsString(req.getServices()) : null);
            profile.setModes(req.getModes() != null ?
                    mapper.writeValueAsString(req.getModes()) : null);
            profile.setLanguages(req.getLanguages() != null ?
                    mapper.writeValueAsString(req.getLanguages()) : null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        NGOProfile saved = repository.save(profile);

        // ✅ Insert / Update Directory Profile
        DirectoryProfile dp = directoryRepo
                .findByExternalId(saved.getUserId())
                .orElse(new DirectoryProfile());

        dp.setExternalId(saved.getUserId());
        dp.setName(saved.getName());
        dp.setType("NGO");
        dp.setState(saved.getState());
        dp.setSpecialization("NGO Services");

        directoryRepo.save(dp);

        return saved;
    }

    public NGOProfile getProfile(String userId) {
        return repository.findByUserId(userId).orElse(null);
    }
}
