package com.legalaid.backend.service.directory.providers;

import com.legalaid.backend.model.directory.DirectoryProfile;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;

@Service
public class NgoCsvProvider {

    private final DirectoryProfileRepository repo;

    public NgoCsvProvider(DirectoryProfileRepository repo) {
        this.repo = repo;
    }

    public int importCsv() {
    int imported = 0;

    try {
        var resource = new ClassPathResource("data/delhi_ngo_directory.csv");

        BufferedReader br = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)
        );

        String line;
        boolean header = true;

        while ((line = br.readLine()) != null) {

            if (header) {
                header = false;
                continue;
            }

            String[] c = line.split(",", -1);

            if (c.length < 4) continue;

            String regId = c[0].trim();
            String name = c[1].trim();
            String location = c[2].trim();
            String specialization = c[3].trim();

            DirectoryProfile profile =
                    repo.findByExternalId(regId)
                        .orElse(new DirectoryProfile());

            profile.setExternalId(regId);
            profile.setName(name);
            profile.setType("NGO");
            profile.setState(location);          // storing location here
            profile.setEmail(null);              // no email provided
            profile.setSpecialization(specialization);    // if notes field exists

            repo.save(profile);
            imported++;
        }

        br.close();

    } catch (Exception e) {
        throw new RuntimeException("CSV Import Failed: " + e.getMessage());
    }

    return imported;
}

}
