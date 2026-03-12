package com.legalaid.backend.controller;

import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.enums.LogStatus;
import com.legalaid.backend.model.CaseRequest;
import com.legalaid.backend.model.Role;
import com.legalaid.backend.model.User;
import com.legalaid.backend.repository.UserRepository;
import com.legalaid.backend.service.CaseService;
import com.legalaid.backend.service.SystemLogService;
import com.legalaid.backend.service.directory.DirectoryIngestionService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final CaseService caseService;
    private final SystemLogService systemLogService;

    public AdminController(UserRepository userRepository,
                           CaseService caseService,
                           SystemLogService systemLogService) {
        this.userRepository = userRepository;
        this.caseService = caseService;
        this.systemLogService = systemLogService;
    }

    // ============== PENDING USERS ==============
    @GetMapping("/pending-users")
    public List<User> getPendingUsers() {
        return userRepository.findByRoleInAndVerifiedFalse(
                List.of(Role.LAWYER, Role.NGO)
        );
    }

    // APPROVE USER
    @PutMapping("/approve/{userId}")
    public String approveUser(@PathVariable Long userId,
                              @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerified(true);
        userRepository.save(user);

        systemLogService.log(
                LogCategory.ADMIN,
                "APPROVED_USER",
                userDetails.getUsername(),
                user.getEmail(),
                LogStatus.SUCCESS,
                null,
                null
        );

        return "User approved successfully";
    }

    // REJECT USER
    @PutMapping("/reject/{userId}")
    public String rejectUser(@PathVariable Long userId,
                             @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        systemLogService.log(
                LogCategory.ADMIN,
                "REJECTED_USER",
                userDetails.getUsername(),
                user.getEmail(),
                LogStatus.WARNING,
                null,
                null
        );

        return "User rejected successfully";
    }

    // ============== USERS LIST ==============
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ADMIN PROFILE
    @GetMapping("/me")
    public User getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ============== CASE VIEW API (IMPORTANT) ==============
    @GetMapping("/cases/{id}")
    public ResponseEntity<CaseRequest> getCaseById(@PathVariable Long id) {
        CaseRequest caseRequest = caseService.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        return ResponseEntity.ok(caseRequest);
    }

    
    @Autowired
private DirectoryIngestionService directoryIngestionService;

@PostMapping("/ingestion/ngo/run")
public ResponseEntity<?> runNgoIngestion() {
    int count = directoryIngestionService.runNgoIngestion();
    return ResponseEntity.ok("Imported NGOs: " + count);
}



// @Autowired
// private SystemLogService systemLogService;


}

