package com.hms.microservices.patient.bed;

import jakarta.validation.constraints.NotBlank;

public record BedStatusRequest(
        @NotBlank String status,
        Long occupiedById
) {
}
