package com.hms.microservices.patient.bed;

import com.hms.microservices.patient.activity.ActivityService;
import com.hms.microservices.patient.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BedService {
    private final BedRepository bedRepository;
    private final ActivityService activityService;

    public BedService(BedRepository bedRepository, ActivityService activityService) {
        this.bedRepository = bedRepository;
        this.activityService = activityService;
    }

    @Transactional(readOnly = true)
    public List<BedResponse> findAll() {
        return bedRepository.findAll()
                .stream()
                .map(BedResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BedResponse findById(String id) {
        return BedResponse.from(findBed(id));
    }

    @Transactional
    public BedResponse updateStatus(String id, BedStatusRequest request) {
        Bed bed = findBed(id);
        bed.updateStatus(request.status(), request.occupiedById());
        activityService.log("Bed " + bed.getNumber() + " marked " + request.status() + ".", "bed");
        return BedResponse.from(bed);
    }

    @Transactional
    public BedResponse cleaningComplete(String id) {
        Bed bed = findBed(id);
        bed.markAvailable();
        activityService.log("Bed " + bed.getNumber() + " is sanitized and available.", "bed");
        return BedResponse.from(bed);
    }

    private Bed findBed(String id) {
        return bedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found: " + id));
    }
}
