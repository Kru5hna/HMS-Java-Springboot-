package com.hms.microservices.patient.activity;

public record ActivityResponse(
        Long id,
        String text,
        String time,
        String type
) {
    public static ActivityResponse from(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getText(),
                activity.getTimeLabel(),
                activity.getType()
        );
    }
}
