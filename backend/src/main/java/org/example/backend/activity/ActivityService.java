package org.example.backend.activity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityService {
    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> findAll() {
        return activityRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ActivityResponse::from)
                .toList();
    }

    @Transactional
    public void log(String text, String type) {
        activityRepository.save(new Activity(text, "Just now", type));
    }
}
