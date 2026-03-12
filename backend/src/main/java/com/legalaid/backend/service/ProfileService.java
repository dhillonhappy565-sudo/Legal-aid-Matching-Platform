package com.legalaid.backend.service;

import com.legalaid.backend.dto.ProfileUpdateRequest;
import com.legalaid.backend.model.User;
import com.legalaid.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User getProfile(String email) {
    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
}


    public User updateProfile(String emailFromToken,
                              ProfileUpdateRequest request) {

        User user = userRepository.findByEmail(emailFromToken)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ---- NAME ----
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }

        // ---- EMAIL ----
        if (request.getEmail() != null &&
            !request.getEmail().isBlank() &&
            !request.getEmail().equals(user.getEmail())) {

            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already in use");
            }

            user.setEmail(request.getEmail());
        }

        // ---- PASSWORD ----
        if (request.getPassword() != null &&
            !request.getPassword().isBlank()) {

            user.setPassword(
                passwordEncoder.encode(request.getPassword())
            );
        }

//         if (request.getOrganization() != null)
//     user.setOrganization(request.getOrganization());

// if (request.getExpertise() != null)
//     user.setExpertise(request.getExpertise());

        // 🔒 role & verified are NEVER touched
        return userRepository.save(user);
    }
}


//  if (request.getName() != null)
//             user.setName(request.getName());

//         if (request.getUsername() != null)
//             user.setUsername(request.getUsername());

//         if (request.getLocation() != null)
//             user.setLocation(request.getLocation());

//         if (request.getContactInfo() != null)
//             user.setContactInfo(request.getContactInfo());

//         if (request.getOrganization() != null)
//             user.setOrganization(request.getOrganization());

//         if (request.getExpertise() != null)
//             user.setExpertise(request.getExpertise());

//         return userRepository.save(user);
//     }