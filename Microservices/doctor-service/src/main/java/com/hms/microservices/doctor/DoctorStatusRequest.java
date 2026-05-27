package com.hms.microservices.doctor;

import jakarta.validation.constraints.NotBlank;

public record DoctorStatusRequest(
        @NotBlank String status
) {
}
