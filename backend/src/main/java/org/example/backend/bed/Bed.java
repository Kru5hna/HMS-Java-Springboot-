package org.example.backend.bed;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "beds")
public class Bed {
    @Id
    private String id;

    @Column(name = "bed_number", nullable = false)
    private String number;

    @Column(nullable = false)
    private String ward;

    @Column(nullable = false)
    private String status;

    @Column(name = "occupied_by_id")
    private Long occupiedById;

    protected Bed() {
    }

    public Bed(String id, String number, String ward, String status, Long occupiedById) {
        this.id = id;
        this.number = number;
        this.ward = ward;
        this.status = status;
        this.occupiedById = occupiedById;
    }

    public String getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

    public String getWard() {
        return ward;
    }

    public String getStatus() {
        return status;
    }

    public Long getOccupiedById() {
        return occupiedById;
    }

    public void updateStatus(String status, Long occupiedById) {
        this.status = status;
        this.occupiedById = occupiedById;
    }

    public void occupy(Long patientId) {
        this.status = "Occupied";
        this.occupiedById = patientId;
    }

    public void markCleaning() {
        this.status = "Cleaning";
        this.occupiedById = null;
    }

    public void markAvailable() {
        this.status = "Available";
        this.occupiedById = null;
    }
}
