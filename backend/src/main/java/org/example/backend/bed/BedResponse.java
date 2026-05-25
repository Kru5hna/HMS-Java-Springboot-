package org.example.backend.bed;

public record BedResponse(
        String id,
        String number,
        String ward,
        String status,
        Long occupiedById
) {
    static BedResponse from(Bed bed) {
        return new BedResponse(
                bed.getId(),
                bed.getNumber(),
                bed.getWard(),
                bed.getStatus(),
                bed.getOccupiedById()
        );
    }
}
