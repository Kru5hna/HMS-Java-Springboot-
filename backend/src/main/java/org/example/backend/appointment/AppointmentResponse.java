package org.example.backend.appointment;

import java.time.LocalDate;

public record AppointmentResponse(
        Long id,
        String patientName,
        String doctorName,
        LocalDate date,
        String time,
        String status,
        String reason
) {
    static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatientName(),
                appointment.getDoctorName(),
                appointment.getDate(),
                appointment.getTime(),
                appointment.getStatus(),
                appointment.getReason()
        );
    }
}
