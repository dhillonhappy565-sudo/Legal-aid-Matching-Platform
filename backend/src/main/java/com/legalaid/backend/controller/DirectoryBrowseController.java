package com.legalaid.backend.controller;

import com.legalaid.backend.model.directory.DirectoryProfile;
import com.legalaid.backend.repository.directory.DirectoryProfileRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/directory")
public class DirectoryBrowseController {

    private final DirectoryProfileRepository repo;

    public DirectoryBrowseController(DirectoryProfileRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/profiles/all")
    public List<DirectoryProfile> getAll() {
        return repo.findAll();
    }
}