package com.hms.microservices.patient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PrescriptionRequest(
        @NotBlank @Size(max = 1000) String text
) {
}
