package org.example.backend.doctor;

import org.example.backend.activity.ActivityService;
import org.example.backend.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final ActivityService activityService;

    public DoctorService(DoctorRepository doctorRepository, ActivityService activityService) {
        this.doctorRepository = doctorRepository;
        this.activityService = activityService;
    }

    @Transactional
    public DoctorResponse create(DoctorRequest request) {
        Doctor doctor = doctorRepository.save(new Doctor(request));
        activityService.log("Added doctor " + doctor.getName() + ".", "doctor");
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
        activityService.log("Updated doctor " + doctor.getName() + ".", "doctor");
        return DoctorResponse.from(doctor);
    }

    @Transactional
    public DoctorResponse updateStatus(Long id, DoctorStatusRequest request) {
        Doctor doctor = findDoctor(id);
        doctor.updateStatus(request.status());
        activityService.log(doctor.getName() + " is now " + request.status() + ".", "doctor");
        return DoctorResponse.from(doctor);
    }

    @Transactional
    public void delete(Long id) {
        Doctor doctor = findDoctor(id);
        doctorRepository.delete(doctor);
        activityService.log("Deleted doctor " + doctor.getName() + ".", "doctor");
    }

    private Doctor findDoctor(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
    }
}
