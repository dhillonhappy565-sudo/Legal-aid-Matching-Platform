package com.legalaid.backend.controller;

import com.legalaid.backend.dto.NGOProfileRequest;
import com.legalaid.backend.model.NGOProfile;
import com.legalaid.backend.service.NGOProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ngo/profile")
public class NGOProfileController {

    private final NGOProfileService service;

    public NGOProfileController(NGOProfileService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public NGOProfile saveProfile(
            @RequestHeader("userId") String userId,
            @RequestBody NGOProfileRequest request
    ) {
        return service.saveOrUpdate(userId, request);
    }

    @GetMapping
    public NGOProfile getProfile(@RequestHeader("userId") String userId) {
        return service.getProfile(userId);
    }
}
