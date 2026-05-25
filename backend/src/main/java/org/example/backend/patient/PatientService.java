package org.example.backend.patient;

import org.example.backend.activity.ActivityService;
import org.example.backend.bed.Bed;
import org.example.backend.bed.BedRepository;
import org.example.backend.common.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final BedRepository bedRepository;
    private final ActivityService activityService;

    public PatientService(
            PatientRepository patientRepository,
            BedRepository bedRepository,
            ActivityService activityService
    ) {
        this.patientRepository = patientRepository;
        this.bedRepository = bedRepository;
        this.activityService = activityService;
    }

    @Transactional
    public PatientResponse create(PatientRequest request) {
        Patient patient = patientRepository.save(new Patient(request));
        occupyBedIfNeeded(patient);
        activityService.log("Registered patient " + patient.getName() + ".", "checkin");
        return PatientResponse.from(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> findAll() {
        return patientRepository.findAll()
                .stream()
                .map(PatientResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PatientResponse findById(Long id) {
        return PatientResponse.from(findPatient(id));
    }

    @Transactional
    public PatientResponse update(Long id, PatientRequest request) {
        Patient patient = findPatient(id);
        releaseOldBedIfNeeded(patient, request.bedId());
        patient.updateFrom(request);
        occupyBedIfNeeded(patient);
        activityService.log("Updated patient " + patient.getName() + ".", "checkin");
        return PatientResponse.from(patient);
    }

    @Transactional
    public PatientResponse discharge(Long id) {
        Patient patient = findPatient(id);
        markPatientBedCleaning(patient);
        patient.discharge();
        activityService.log("Discharged patient " + patient.getName() + ".", "checkin");
        return PatientResponse.from(patient);
    }

    @Transactional
    public PatientResponse addPrescription(Long id, PrescriptionRequest request) {
        Patient patient = findPatient(id);
        patient.addPrescription(request.text());
        activityService.log("Added prescription to " + patient.getName() + ".", "general");
        return PatientResponse.from(patient);
    }

    @Transactional
    public void delete(Long id) {
        Patient patient = findPatient(id);
        markPatientBedCleaning(patient);
        patientRepository.delete(patient);
        activityService.log("Deleted patient " + patient.getName() + ".", "checkin");
    }

    private Patient findPatient(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));
    }

    private void occupyBedIfNeeded(Patient patient) {
        if (!"Admitted".equalsIgnoreCase(patient.getStatus()) || patient.getBedId() == null) {
            return;
        }

        Bed bed = bedRepository.findById(patient.getBedId())
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found: " + patient.getBedId()));

        if (!"Available".equalsIgnoreCase(bed.getStatus()) && !patient.getId().equals(bed.getOccupiedById())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bed is not available: " + bed.getId());
        }

        bed.occupy(patient.getId());
    }

    private void releaseOldBedIfNeeded(Patient patient, String requestedBedId) {
        String normalizedBedId = normalizeBedId(requestedBedId);
        if (patient.getBedId() == null || patient.getBedId().equals(normalizedBedId)) {
            return;
        }

        markPatientBedCleaning(patient);
    }

    private void markPatientBedCleaning(Patient patient) {
        if (patient.getBedId() == null) {
            return;
        }

        bedRepository.findById(patient.getBedId())
                .ifPresent(Bed::markCleaning);
    }

    private String normalizeBedId(String bedId) {
        if (bedId == null || bedId.isBlank() || "None".equalsIgnoreCase(bedId)) {
            return null;
        }

        return bedId;
    }
}
