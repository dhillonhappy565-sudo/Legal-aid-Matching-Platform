package com.legalaid.backend.controller;

import com.legalaid.backend.model.directory.DirectoryProfile;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citizen/directory")
public class CitizenDirectoryController {

    @Autowired
    private DirectoryProfileRepository repo;

    @GetMapping("/profiles")
    public List<DirectoryProfile> getProfiles() {
        return repo.findAll();
    }
}
