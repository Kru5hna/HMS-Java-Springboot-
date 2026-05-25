package org.example.backend.doctor;

import jakarta.validation.constraints.NotBlank;

public record DoctorStatusRequest(
        @NotBlank String status
) {
}
