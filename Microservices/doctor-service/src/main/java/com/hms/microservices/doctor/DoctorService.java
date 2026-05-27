package com.hms.microservices.doctor;

import com.hms.microservices.doctor.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${app.patient-service.url:http://localhost:8082}")
    private String patientServiceUrl;

    public DoctorService(DoctorRepository doctorRepository, RestTemplate restTemplate) {
        this.doctorRepository = doctorRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public DoctorResponse create(DoctorRequest request) {
        Doctor doctor = doctorRepository.save(new Doctor(request));
        logActivity("Added doctor " + doctor.getName() + ".", "doctor");
        return DoctorResponse.from(doctor);
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> findAll() {
        return doctorRepository.findAll()
                .stream()
                .map(DoctorResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DoctorResponse findById(Long id) {
        return DoctorResponse.from(findDoctor(id));
    }

    @Transactional
    public DoctorResponse update(Long id, DoctorRequest request) {
        Doctor doctor = findDoctor(id);
        doctor.updateFrom(request);
        logActivity("Updated doctor " + doctor.getName() + ".", "doctor");
        return DoctorResponse.from(doctor);
    }

    @Transactional
    public DoctorResponse updateStatus(Long id, DoctorStatusRequest request) {
        Doctor doctor = findDoctor(id);
        doctor.updateStatus(request.status());
        logActivity(doctor.getName() + " is now " + request.status() + ".", "doctor");
        return DoctorResponse.from(doctor);
    }

    @Transactional
    public void delete(Long id) {
        Doctor doctor = findDoctor(id);
        doctorRepository.delete(doctor);
        logActivity("Deleted doctor " + doctor.getName() + ".", "doctor");
    }

    private Doctor findDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
    }

    private void logActivity(String text, String type) {
        try {
            Map<String, String> body = Map.of("text", text, "type", type);
            restTemplate.postForObject(patientServiceUrl + "/api/activities", body, Void.class);
        } catch (Exception e) {
            System.err.println("Failed to log activity centrally: " + e.getMessage());
        }
    }
}
