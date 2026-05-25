# 06. Hospital Domain Modeling

This topic grows the first patient feature into doctors and appointments.

## Goal

Learn how to think about:

- Hospital modules
- SQL relationships
- JPA relationships
- DTO design for related data
- Business rules around appointments

## Starter Domain

Use three core modules first:

```text
Patients
Doctors
Appointments
```

Suggested database relationships:

```text
Patient 1 ---- many Appointments
Doctor  1 ---- many Appointments
```

Each appointment belongs to exactly one patient and one doctor.

## Starter Table Design

| Table | Useful columns |
| --- | --- |
| `patients` | `id`, names, date of birth, gender, email, phone |
| `doctors` | `id`, names, specialization, email, phone |
| `appointments` | `id`, `patient_id`, `doctor_id`, time, status, notes |

## Doctor Feature

Create doctor CRUD after patient CRUD.

Candidate doctor fields:

- First name
- Last name
- Specialization
- Email
- Phone number

Keep the same pattern:

```text
Doctor
DoctorRequest
DoctorResponse
DoctorRepository
DoctorService
DoctorController
```

## Appointment Input DTO

The frontend should not submit entire patient and doctor entity graphs.

Use IDs:

```java
public record AppointmentRequest(
        Long patientId,
        Long doctorId,
        LocalDateTime appointmentTime,
        String notes
) {
}
```

The service should load both related records:

```java
Patient patient = patientRepository.findById(request.patientId())
        .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

Doctor doctor = doctorRepository.findById(request.doctorId())
        .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
```

## JPA Relationship Shape

Simplified appointment entity:

```java
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(optional = false)
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    @Column(nullable = false)
    private String status;
}
```

## Appointment Response DTO

Design JSON for the frontend screen, not for Hibernate internals.

Example:

```java
public record AppointmentResponse(
        Long id,
        Long patientId,
        String patientName,
        Long doctorId,
        String doctorName,
        String doctorSpecialization,
        LocalDateTime appointmentTime,
        String status
) {
}
```

This avoids returning huge nested patient and doctor objects when the screen only
needs identifiers and display names.

## Appointment API Ideas

| Method | URL | Purpose |
| --- | --- | --- |
| `POST` | `/api/appointments` | Create appointment |
| `GET` | `/api/appointments` | List appointments |
| `GET` | `/api/patients/{id}/appointments` | Patient appointments |
| `GET` | `/api/doctors/{id}/appointments` | Doctor appointments |
| `PUT` | `/api/appointments/{id}` | Reschedule or edit |

## Business Rules to Discuss

Appointments need more rules than simple CRUD:

- Patient must exist.
- Doctor must exist.
- Appointment time should be valid.
- Appointment status should use controlled values.
- Doctor overlap rules may be required.
- Cancellation rules may differ from deletion rules.

## Keep Relationships Manageable

Beginner risk:

- Add bidirectional relationships everywhere.
- Return entities directly.
- Get recursive JSON or large unexpected responses.

Better habit:

- Start with the relationship needed for the use case.
- Return DTOs.
- Add queries for specific screens.

## Future Hospital Modules

Add these only after core appointment flow works:

- Admissions and rooms
- Prescriptions
- Lab tests
- Billing
- Inventory
- Notifications

## Practice

1. Build doctor CRUD by repeating the patient pattern.
2. Add an appointment entity linked to patient and doctor.
3. Make appointment create reject missing IDs.
4. Return a compact appointment response DTO.
