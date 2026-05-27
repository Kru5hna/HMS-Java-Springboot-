package com.hms.microservices.appointment;

import com.hms.microservices.appointment.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${app.patient-service.url:http://localhost:8082}")
    private String patientServiceUrl;

    public AppointmentService(AppointmentRepository appointmentRepository, RestTemplate restTemplate) {
        this.appointmentRepository = appointmentRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        Appointment appointment = appointmentRepository.save(new Appointment(request));
        logActivity(
                "Appointment booked for " + appointment.getPatientName() + " with " + appointment.getDoctorName() + ".",
                "appointment"
        );
        return AppointmentResponse.from(appointment);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> findAll() {
        return appointmentRepository.findAll()
                .stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AppointmentResponse findById(Long id) {
        return AppointmentResponse.from(findAppointment(id));
    }

    @Transactional
    public AppointmentResponse update(Long id, AppointmentRequest request) {
        Appointment appointment = findAppointment(id);
        appointment.updateFrom(request);
        logActivity("Updated appointment for " + appointment.getPatientName() + ".", "appointment");
        return AppointmentResponse.from(appointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, AppointmentStatusRequest request) {
        Appointment appointment = findAppointment(id);
        appointment.updateStatus(request.status());
        logActivity(
                "Appointment for " + appointment.getPatientName() + " was " + request.status().toLowerCase() + ".",
                "appointment"
        );
        return AppointmentResponse.from(appointment);
    }

    @Transactional
    public void delete(Long id) {
        Appointment appointment = findAppointment(id);
        appointmentRepository.delete(appointment);
        logActivity("Deleted appointment for " + appointment.getPatientName() + ".", "appointment");
    }

    private Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
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
