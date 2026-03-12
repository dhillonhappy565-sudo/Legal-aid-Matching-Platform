package com.legalaid.backend.controller;

import com.legalaid.backend.dto.AnalyticsOverviewDTO;
import com.legalaid.backend.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    @GetMapping("/overview")
    public AnalyticsOverviewDTO overview() {
        return service.getOverview();
    }
}
