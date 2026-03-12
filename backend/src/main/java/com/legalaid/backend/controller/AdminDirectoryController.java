package com.legalaid.backend.controller;

import com.legalaid.backend.model.directory.IngestionRun;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import com.legalaid.backend.repository.directory.IngestionRunRepository;
import com.legalaid.backend.service.directory.DirectoryIngestionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/directory")
public class AdminDirectoryController {

    private final DirectoryIngestionService service;
    private final DirectoryProfileRepository profileRepo;
    private final IngestionRunRepository runRepo;

    public AdminDirectoryController(
            DirectoryIngestionService service,
            DirectoryProfileRepository profileRepo,
            IngestionRunRepository runRepo
    ) {
        this.service = service;
        this.profileRepo = profileRepo;
        this.runRepo = runRepo;
    }

    // @PostMapping("/import/ngo-darpan")
    // public IngestionRun runNgoImport() {
    //     return service.runNgoDarpanImport();
    // }

    @PostMapping("/import/csv")
public IngestionRun runCsvImport() {
    return service.runCsvImport();
}

@PostMapping("/import/lawyers")
public IngestionRun runLawyerCsv() {
    return service.runLawyerCsvImport();
}

    @GetMapping("/profiles")
    public List<?> allProfiles() {
        return profileRepo.findAll();
    }

    @GetMapping("/runs")
    public List<IngestionRun> lastRuns() {
        return runRepo.findTop5ByOrderByRunAtDesc();
    }
}
