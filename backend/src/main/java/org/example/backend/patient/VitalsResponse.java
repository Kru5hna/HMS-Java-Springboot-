package org.example.backend.patient;

public record VitalsResponse(
        String bp,
        Integer pulse,
        String temp,
        Integer spo2
) {
    static VitalsResponse from(Vitals vitals) {
        return new VitalsResponse(vitals.getBp(), vitals.getPulse(), vitals.getTemp(), vitals.getSpo2());
    }
}
