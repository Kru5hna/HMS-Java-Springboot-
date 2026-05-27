package com.hms.microservices.patient;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String gender;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String department;

    @Column(name = "bed_id")
    private String bedId;

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Embedded
    private Vitals vitals;

    @Column(length = 2000)
    private String diagnosis;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "patient_prescriptions", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "prescription_text", nullable = false, length = 1000)
    private List<String> prescriptions = new ArrayList<>();

    protected Patient() {
    }

    public Patient(PatientRequest request) {
        updateFrom(request);
        this.checkInDate = LocalDate.now();
        this.vitals = Vitals.intakeDefaults();
    }

    public Patient(
            String name,
            Integer age,
            String gender,
            String bloodGroup,
            String contact,
            String status,
            String department,
            String bedId,
            String doctorName,
            LocalDate checkInDate,
            Vitals vitals,
            String diagnosis,
            List<String> prescriptions
    ) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.contact = contact;
        this.status = status;
        this.department = department;
        this.bedId = normalizeBedId(bedId);
        this.doctorName = doctorName;
        this.checkInDate = checkInDate;
        this.vitals = vitals;
        this.diagnosis = diagnosis;
        this.prescriptions.addAll(prescriptions);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public String getContact() {
        return contact;
    }

    public String getStatus() {
        return status;
    }

    public String getDepartment() {
        return department;
    }

    public String getBedId() {
        return bedId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public Vitals getVitals() {
        return vitals;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public List<String> getPrescriptions() {
        return prescriptions;
    }

    public void updateFrom(PatientRequest request) {
        this.name = request.name();
        this.age = request.age();
        this.gender = request.gender();
        this.bloodGroup = request.bloodGroup();
        this.contact = request.contact();
        this.status = request.status();
        this.department = request.department();
        this.bedId = normalizeBedId(request.bedId());
        this.doctorName = request.doctorName();
        this.diagnosis = request.diagnosis();
    }

    public void discharge() {
        this.status = "Discharged";
        this.bedId = null;
    }

    public void addPrescription(String prescription) {
        this.prescriptions.add(prescription);
    }

    private String normalizeBedId(String requestedBedId) {
        if (requestedBedId == null || requestedBedId.isBlank() || "None".equalsIgnoreCase(requestedBedId)) {
            return null;
        }

        return requestedBedId;
    }
}
