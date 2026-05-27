package com.hms.microservices.patient;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Vitals {
    @Column(name = "blood_pressure", nullable = false)
    private String bp;

    @Column(name = "pulse_bpm", nullable = false)
    private Integer pulse;

    @Column(name = "temperature", nullable = false)
    private String temp;

    @Column(name = "oxygen_saturation", nullable = false)
    private Integer spo2;

    protected Vitals() {
    }

    public Vitals(String bp, Integer pulse, String temp, Integer spo2) {
        this.bp = bp;
        this.pulse = pulse;
        this.temp = temp;
        this.spo2 = spo2;
    }

    public static Vitals intakeDefaults() {
        return new Vitals("120/80", 75, "98.6 F", 98);
    }

    public String getBp() {
        return bp;
    }

    public Integer getPulse() {
        return pulse;
    }

    public String getTemp() {
        return temp;
    }

    public Integer getSpo2() {
        return spo2;
    }
}
