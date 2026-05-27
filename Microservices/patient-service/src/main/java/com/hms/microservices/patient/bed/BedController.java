package com.hms.microservices.patient.bed;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/beds")
public class BedController {
    private final BedService bedService;

    public BedController(BedService bedService) {
        this.bedService = bedService;
    }

    @GetMapping
    public List<BedResponse> findAll() {
        return bedService.findAll();
    }

    @GetMapping("/{id}")
    public BedResponse findById(@PathVariable String id) {
        return bedService.findById(id);
    }

    @PatchMapping("/{id}/status")
    public BedResponse updateStatus(@PathVariable String id, @Valid @RequestBody BedStatusRequest request) {
        return bedService.updateStatus(id, request);
    }

    @PatchMapping("/{id}/cleaning-complete")
    public BedResponse cleaningComplete(@PathVariable String id) {
        return bedService.cleaningComplete(id);
    }
}
