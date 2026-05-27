package com.hms.microservices.doctor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String spec;

    @Column(nullable = false)
    private String status;

    @Column(name = "patients_count", nullable = false)
    private Integer patientsCount;

    @Column(name = "experience", nullable = false)
    private String exp;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private String email;

    protected Doctor() {
    }

    public Doctor(DoctorRequest request) {
        updateFrom(request);
    }

    public Doctor(
            String name,
            String spec,
            String status,
            Integer patientsCount,
            String exp,
            String contact,
            String email
    ) {
        this.name = name;
        this.spec = spec;
        this.status = status;
        this.patientsCount = patientsCount;
        this.exp = exp;
        this.contact = contact;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSpec() {
        return spec;
    }

    public String getStatus() {
        return status;
    }

    public Integer getPatientsCount() {
        return patientsCount;
    }

    public String getExp() {
        return exp;
    }

    public String getContact() {
        return contact;
    }

    public String getEmail() {
        return email;
    }

    public void updateFrom(DoctorRequest request) {
        this.name = request.name();
        this.spec = request.spec();
        this.status = request.status();
        this.patientsCount = request.patientsCount();
        this.exp = request.exp();
        this.contact = request.contact();
        this.email = request.email();
    }

    public void updateStatus(String status) {
        this.status = status;
    }
}
