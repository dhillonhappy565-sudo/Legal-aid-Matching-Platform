package com.legalaid.backend.controller;

import com.legalaid.backend.dto.ProfileUpdateRequest;
import com.legalaid.backend.model.User;
import com.legalaid.backend.service.ProfileService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // GET PROFILE
    @GetMapping("/me")
    public User getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return profileService.getProfile(email);
    }

    // UPDATE PROFILE
    @PutMapping("/update")
    public User updateProfile(
            @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        return profileService.updateProfile(email, request);
    }
}
