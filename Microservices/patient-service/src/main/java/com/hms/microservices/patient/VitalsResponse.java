package com.hms.microservices.patient;

public record VitalsResponse(
        String bp,
        Integer pulse,
        String temp,
        Integer spo2
) {
    public static VitalsResponse from(Vitals vitals) {
        return new VitalsResponse(vitals.getBp(), vitals.getPulse(), vitals.getTemp(), vitals.getSpo2());
    }
}
