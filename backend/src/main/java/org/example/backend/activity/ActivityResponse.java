package org.example.backend.activity;

public record ActivityResponse(
        Long id,
        String text,
        String time,
        String type
) {
    static ActivityResponse from(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getText(),
                activity.getTimeLabel(),
                activity.getType()
        );
    }
}
