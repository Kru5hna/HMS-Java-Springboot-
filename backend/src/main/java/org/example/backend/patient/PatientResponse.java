package org.example.backend.patient;

import java.time.LocalDate;
import java.util.List;

public record PatientResponse(
        Long id,
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
        VitalsResponse vitals,
        String diagnosis,
        List<String> prescriptions
) {
    static PatientResponse from(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getName(),
                patient.getAge(),
                patient.getGender(),
                patient.getBloodGroup(),
                patient.getContact(),
                patient.getStatus(),
                patient.getDepartment(),
                patient.getBedId() == null ? "None" : patient.getBedId(),
                patient.getDoctorName(),
                patient.getCheckInDate(),
                VitalsResponse.from(patient.getVitals()),
                patient.getDiagnosis(),
                List.copyOf(patient.getPrescriptions())
        );
    }
}
