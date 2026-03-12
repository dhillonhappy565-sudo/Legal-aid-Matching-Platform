package com.legalaid.backend.service.directory;

import com.legalaid.backend.model.directory.*;
import com.legalaid.backend.repository.directory.*;
import com.legalaid.backend.service.directory.providers.LawyerCsvProvider;
import com.legalaid.backend.service.directory.providers.NgoCsvProvider;
import com.legalaid.backend.service.directory.providers.NgoDarpanProvider;

import jakarta.persistence.Column;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DirectoryIngestionService {

    private final DirectoryProfileRepository profileRepo;
    private final IngestionRunRepository runRepo;
    private NgoDarpanProvider ngoDarpanProvider;
    private final LawyerCsvProvider lawyerCsvProvider;
    @Column(name = "specialization")
    private String specialization;
    private final NgoCsvProvider csvProvider;

public DirectoryIngestionService(
        DirectoryProfileRepository profileRepo,
        IngestionRunRepository runRepo,
        NgoDarpanProvider ngoDarpanProvider,
        NgoCsvProvider csvProvider,
        LawyerCsvProvider lawyerCsvProvider
) {
    this.profileRepo = profileRepo;
    this.runRepo = runRepo;
    this.ngoDarpanProvider = ngoDarpanProvider;
    this.csvProvider = csvProvider;
    this.lawyerCsvProvider = lawyerCsvProvider;
}

    @Transactional
public IngestionRun runLawyerCsvImport() {

    IngestionRun run = new IngestionRun();
    run.setSource("LAWYER_CSV");

    try {
        int imported = lawyerCsvProvider.importCsv();

        run.setImported(imported);
        run.setUpdated(0);
        run.setSkipped(0);
        run.setStatus("SUCCESS");
        run.setNotes(null);

    } catch (Exception e) {
        run.setStatus("FAILED");
        run.setNotes(e.getMessage());
    }

    return runRepo.save(run);
}

    public int runNgoIngestion() {
    return ngoDarpanProvider.ingestAll();
}

@Transactional
public IngestionRun runCsvImport() {

    IngestionRun run = new IngestionRun();
    run.setSource("CSV");

    try {
        int imported = csvProvider.importCsv();

        run.setImported(imported);
        run.setUpdated(0);
        run.setSkipped(0);
        run.setStatus("SUCCESS");
        run.setNotes(null);

    } catch (Exception e) {
        run.setStatus("FAILED");
        run.setNotes(e.getMessage());
    }

    return runRepo.save(run);
}



    
}
