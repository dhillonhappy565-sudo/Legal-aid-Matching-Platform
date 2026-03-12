package com.legalaid.backend.controller;

import com.legalaid.backend.enums.LogCategory;
import com.legalaid.backend.model.SystemLog;
import com.legalaid.backend.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/system-logs")
@PreAuthorize("hasRole('ADMIN')")
public class SystemLogController {

    @Autowired
    private SystemLogRepository repository;

    @GetMapping
    public Page<SystemLog> getLogs(
        @RequestParam(required = false) LogCategory category,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(
            page, size, Sort.by("timestamp").descending()
        );

        if (category != null) {
            return repository.findByCategory(category, pageable);
        }

        if (search != null && !search.isEmpty()) {
            return repository
                .findByActorEmailContainingIgnoreCaseOrTargetEmailContainingIgnoreCase(
                    search, search, pageable
                );
        }

        return repository.findAll(pageable);
    }
    
}
