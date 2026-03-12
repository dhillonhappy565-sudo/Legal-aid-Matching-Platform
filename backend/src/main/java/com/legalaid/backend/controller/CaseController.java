package com.legalaid.backend.controller;

import com.legalaid.backend.model.CaseRequest;
import com.legalaid.backend.service.CaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cases")
public class CaseController {

    private final CaseService service;

    public CaseController(CaseService service) {
        this.service = service;
    }

    @PostMapping
    public CaseRequest create(@RequestBody CaseRequest request) {
        return service.create(request);
    }

    @GetMapping("/my")
    public List<CaseRequest> myCases() {
        return service.getMyCases();
    }

    @PutMapping("/{id}")
    public CaseRequest update(
            @PathVariable Long id,
            @RequestBody CaseRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
