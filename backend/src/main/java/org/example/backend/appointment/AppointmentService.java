package org.example.backend.appointment;

import org.example.backend.activity.ActivityService;
import org.example.backend.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final ActivityService activityService;

    public AppointmentService(AppointmentRepository appointmentRepository, ActivityService activityService) {
        this.appointmentRepository = appointmentRepository;
        this.activityService = activityService;
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        Appointment appointment = appointmentRepository.save(new Appointment(request));
        activityService.log(
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
        activityService.log("Updated appointment for " + appointment.getPatientName() + ".", "appointment");
        return AppointmentResponse.from(appointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, AppointmentStatusRequest request) {
        Appointment appointment = findAppointment(id);
        appointment.updateStatus(request.status());
        activityService.log(
                "Appointment for " + appointment.getPatientName() + " was " + request.status().toLowerCase() + ".",
                "appointment"
        );
        return AppointmentResponse.from(appointment);
    }

    @Transactional
    public void delete(Long id) {
        Appointment appointment = findAppointment(id);
        appointmentRepository.delete(appointment);
        activityService.log("Deleted appointment for " + appointment.getPatientName() + ".", "appointment");
    }

    private Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
    }
}
