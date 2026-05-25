package org.example.backend.config;

import org.example.backend.activity.Activity;
import org.example.backend.activity.ActivityRepository;
import org.example.backend.appointment.Appointment;
import org.example.backend.appointment.AppointmentRepository;
import org.example.backend.bed.Bed;
import org.example.backend.bed.BedRepository;
import org.example.backend.doctor.Doctor;
import org.example.backend.doctor.DoctorRepository;
import org.example.backend.patient.Patient;
import org.example.backend.patient.PatientRepository;
import org.example.backend.patient.Vitals;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.util.List;

@Configuration
@Profile("dev")
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class SeedDataConfig {
    @Bean
    CommandLineRunner seedHospitalData(
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            BedRepository bedRepository,
            AppointmentRepository appointmentRepository,
            ActivityRepository activityRepository
    ) {
        return args -> {
            seedDoctors(doctorRepository);
            seedPatients(patientRepository);
            seedBeds(bedRepository, patientRepository.findAll());
            seedAppointments(appointmentRepository);
            seedActivities(activityRepository);
        };
    }

    private void seedDoctors(DoctorRepository doctorRepository) {
        if (doctorRepository.count() > 0) {
            return;
        }

        doctorRepository.saveAll(List.of(
                new Doctor("Dr. Sarah Jenkins", "Cardiology", "Available", 12, "14 Years", "+1 555-0101", "sarah.j@caresync.com"),
                new Doctor("Dr. Robert Chen", "Pediatrics", "In Surgery", 8, "10 Years", "+1 555-0102", "robert.c@caresync.com"),
                new Doctor("Dr. Elena Rostova", "Neurology", "Available", 5, "18 Years", "+1 555-0103", "elena.r@caresync.com"),
                new Doctor("Dr. James Carter", "Orthopedics", "Off-Duty", 9, "8 Years", "+1 555-0104", "james.c@caresync.com"),
                new Doctor("Dr. Maria Santos", "General Medicine", "Available", 15, "6 Years", "+1 555-0105", "maria.s@caresync.com")
        ));
    }

    private void seedPatients(PatientRepository patientRepository) {
        if (patientRepository.count() > 0) {
            return;
        }

        patientRepository.saveAll(List.of(
                new Patient(
                        "John Doe",
                        45,
                        "Male",
                        "O+",
                        "+1 555-0199",
                        "Admitted",
                        "Cardiology",
                        "ICU-01",
                        "Dr. Sarah Jenkins",
                        LocalDate.of(2026, 5, 18),
                        new Vitals("135/85", 82, "98.6 F", 97),
                        "Coronary artery disease, post-angioplasty recovery monitoring.",
                        List.of("Aspirin 81mg QD", "Atorvastatin 40mg HS", "Metoprolol 25mg BID")
                ),
                new Patient(
                        "Lily Smith",
                        8,
                        "Female",
                        "A-",
                        "+1 555-0143",
                        "Admitted",
                        "Pediatrics",
                        "PED-02",
                        "Dr. Robert Chen",
                        LocalDate.of(2026, 5, 19),
                        new Vitals("102/68", 96, "101.4 F", 99),
                        "Acute bronchitis with high-grade fever. Hydration management.",
                        List.of("Amoxicillin 250mg TID", "Acetaminophen 160mg q4h PRN")
                ),
                new Patient(
                        "David Vance",
                        62,
                        "Male",
                        "B+",
                        "+1 555-0182",
                        "Admitted",
                        "Neurology",
                        "ICU-03",
                        "Dr. Elena Rostova",
                        LocalDate.of(2026, 5, 15),
                        new Vitals("142/90", 68, "98.2 F", 95),
                        "Transient ischemic attack (TIA) monitoring.",
                        List.of("Clopidogrel 75mg QD", "Lisinopril 10mg QD")
                ),
                new Patient(
                        "Emily Brown",
                        29,
                        "Female",
                        "AB+",
                        "+1 555-0155",
                        "Outpatient",
                        "General Medicine",
                        null,
                        "Dr. Maria Santos",
                        LocalDate.of(2026, 5, 20),
                        new Vitals("118/75", 72, "98.4 F", 99),
                        "Allergy testing and mild seasonal asthma checkup.",
                        List.of("Montelukast 10mg HS", "Fluticasone nasal spray QD")
                ),
                new Patient(
                        "Marcus Stone",
                        38,
                        "Male",
                        "O-",
                        "+1 555-0177",
                        "Discharged",
                        "Orthopedics",
                        null,
                        "Dr. James Carter",
                        LocalDate.of(2026, 5, 10),
                        new Vitals("120/80", 75, "98.6 F", 99),
                        "Fractured distal radius checkup.",
                        List.of("Ibuprofen 400mg q6h PRN")
                )
        ));
    }

    private void seedBeds(BedRepository bedRepository, List<Patient> patients) {
        if (bedRepository.count() > 0) {
            return;
        }

        Long johnId = patientId(patients, "John Doe");
        Long lilyId = patientId(patients, "Lily Smith");
        Long davidId = patientId(patients, "David Vance");

        bedRepository.saveAll(List.of(
                new Bed("ICU-01", "101", "ICU", "Occupied", johnId),
                new Bed("ICU-02", "102", "ICU", "Available", null),
                new Bed("ICU-03", "103", "ICU", "Occupied", davidId),
                new Bed("ICU-04", "104", "ICU", "Cleaning", null),
                new Bed("PED-01", "201", "Pediatric Ward", "Available", null),
                new Bed("PED-02", "202", "Pediatric Ward", "Occupied", lilyId),
                new Bed("PED-03", "203", "Pediatric Ward", "Available", null),
                new Bed("GW-01", "301", "General Ward", "Available", null),
                new Bed("GW-02", "302", "General Ward", "Available", null),
                new Bed("GW-03", "303", "General Ward", "Available", null),
                new Bed("ER-01", "E-1", "Emergency Room", "Available", null),
                new Bed("ER-02", "E-2", "Emergency Room", "Cleaning", null)
        ));
    }

    private void seedAppointments(AppointmentRepository appointmentRepository) {
        if (appointmentRepository.count() > 0) {
            return;
        }

        appointmentRepository.saveAll(List.of(
                new Appointment("John Doe", "Dr. Sarah Jenkins", LocalDate.of(2026, 5, 20), "10:30 AM", "Confirmed", "Post-angioplasty follow-up"),
                new Appointment("Lily Smith", "Dr. Robert Chen", LocalDate.of(2026, 5, 20), "02:15 PM", "Confirmed", "Bronchitis recovery review"),
                new Appointment("Emily Brown", "Dr. Maria Santos", LocalDate.of(2026, 5, 21), "09:00 AM", "Pending", "Allergy panel and asthma check"),
                new Appointment("David Vance", "Dr. Elena Rostova", LocalDate.of(2026, 5, 22), "11:30 AM", "Pending", "Chronic migraine management evaluation")
        ));
    }

    private void seedActivities(ActivityRepository activityRepository) {
        if (activityRepository.count() > 0) {
            return;
        }

        activityRepository.saveAll(List.of(
                new Activity("Patient John Doe checked into ICU Bed 101.", "2 hours ago", "checkin"),
                new Activity("Dr. Robert Chen entered surgery for pediatric patient.", "3 hours ago", "doctor"),
                new Activity("ICU Bed 104 set to cleaning status.", "4 hours ago", "bed"),
                new Activity("Appointment scheduled for Emily Brown with Dr. Maria Santos.", "5 hours ago", "appointment")
        ));
    }

    private Long patientId(List<Patient> patients, String name) {
        return patients.stream()
                .filter(patient -> patient.getName().equals(name))
                .map(Patient::getId)
                .findFirst()
                .orElse(null);
    }
}
