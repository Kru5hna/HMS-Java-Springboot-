package com.hms.microservices.patient.activity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<ActivityResponse> findAll() {
        return activityService.findAll();
    }

    @PostMapping
    public void log(@org.springframework.web.bind.annotation.RequestBody ActivityLogRequest request) {
        activityService.log(request.text(), request.type());
    }
}
