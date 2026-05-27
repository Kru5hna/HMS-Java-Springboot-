package com.hms.microservices.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DoctorRequest(
        @NotBlank String name,
        @NotBlank String spec,
        @NotBlank String status,
        @NotNull @Min(0) Integer patientsCount,
        @NotBlank String exp,
        @NotBlank String contact,
        @NotBlank @Email String email
) {
}
