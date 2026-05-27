package com.hms.microservices.patient.activity;

public record ActivityLogRequest(
        String text,
        String type
) {
}
