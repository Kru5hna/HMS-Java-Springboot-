package org.example.backend.appointment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate date;

    @Column(name = "appointment_time", nullable = false)
    private String time;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false, length = 1000)
    private String reason;

    protected Appointment() {
    }

    public Appointment(AppointmentRequest request) {
        updateFrom(request);
        this.status = "Pending";
    }

    public Appointment(
            String patientName,
            String doctorName,
            LocalDate date,
            String time,
            String status,
            String reason
    ) {
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.date = date;
        this.time = time;
        this.status = status;
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }

    public void updateFrom(AppointmentRequest request) {
        this.patientName = request.patientName();
        this.doctorName = request.doctorName();
        this.date = request.date();
        this.time = request.time();
        this.reason = request.reason();
    }

    public void updateStatus(String status) {
        this.status = status;
    }
}
