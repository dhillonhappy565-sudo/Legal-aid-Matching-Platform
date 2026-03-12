package com.legalaid.backend.controller;

import com.legalaid.backend.dto.CaseMatchesDTO;
import com.legalaid.backend.service.CitizenMatchService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citizen/matches")
public class CitizenMatchController {

    private final CitizenMatchService service;

    public CitizenMatchController(CitizenMatchService service) {
        this.service = service;
    }

    @GetMapping
    public List<CaseMatchesDTO> getMatches(Authentication authentication) {

        // This comes directly from JWT
        String citizenEmail = authentication.getName();

        return service.getMatchesForCitizen(citizenEmail);
    }
}

