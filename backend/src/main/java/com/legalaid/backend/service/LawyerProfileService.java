package com.legalaid.backend.service;

import com.legalaid.backend.model.directory.DirectoryProfile;
import com.legalaid.backend.model.directory.LawyerProfile;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import com.legalaid.backend.repository.directory.LawyerProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class LawyerProfileService {

    private final LawyerProfileRepository lawyerRepo;
    private final DirectoryProfileRepository directoryRepo;

    public LawyerProfileService(LawyerProfileRepository lawyerRepo,
                                 DirectoryProfileRepository directoryRepo) {
        this.lawyerRepo = lawyerRepo;
        this.directoryRepo = directoryRepo;
    }

    public LawyerProfile save(LawyerProfile profile) {

        LawyerProfile saved = lawyerRepo.save(profile);

        // ✅ Insert into directory table
        DirectoryProfile dp = directoryRepo
                .findByExternalId(saved.getExternalId())
                .orElse(new DirectoryProfile());

        dp.setExternalId(saved.getExternalId());
        dp.setName(saved.getName());
        dp.setType("LAWYER");
        dp.setState(saved.getState());
        dp.setSpecialization(saved.getSpecialization());

        directoryRepo.save(dp);

        return saved;
    }
}
