package com.hms.microservices.doctor;

public record DoctorResponse(
        Long id,
        String name,
        String spec,
        String status,
        Integer patientsCount,
        String exp,
        String contact,
        String email
) {
    public static DoctorResponse from(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpec(),
                doctor.getStatus(),
                doctor.getPatientsCount(),
                doctor.getExp(),
                doctor.getContact(),
                doctor.getEmail()
        );
    }
}
