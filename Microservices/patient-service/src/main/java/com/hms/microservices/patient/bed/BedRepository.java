package com.hms.microservices.patient.bed;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BedRepository extends JpaRepository<Bed, String> {
}
