package org.example.backend.patient;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PatientRequest(
        @NotBlank String name,
        @NotNull @Min(0) @Max(130) Integer age,
        @NotBlank String gender,
        @NotBlank String bloodGroup,
        @NotBlank String contact,
        @NotBlank String status,
        @NotBlank String department,
        String bedId,
        @NotBlank String doctorName,
        @Size(max = 2000) String diagnosis
) {
}
