package com.hms.microservices.appointment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AppointmentRequest(
        @NotBlank String patientName,
        @NotBlank String doctorName,
        @NotNull LocalDate date,
        @NotBlank String time,
        @NotBlank @Size(max = 1000) String reason
) {
}
