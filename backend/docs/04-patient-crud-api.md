# 04. Patient CRUD API

This topic builds the first full hospital backend feature.

## Goal

Build patient CRUD through the standard Spring backend path:

```text
PatientController -> PatientService -> PatientRepository -> MySQL
```

## API Contract

| Method | URL | Purpose |
| --- | --- | --- |
| `POST` | `/api/patients` | Create a patient |
| `GET` | `/api/patients` | List patients |
| `GET` | `/api/patients/{id}` | Read one patient |
| `PUT` | `/api/patients/{id}` | Update one patient |
| `DELETE` | `/api/patients/{id}` | Delete one patient |

## Files to Create

```text
src/main/java/org/example/backend/patient/Patient.java
src/main/java/org/example/backend/patient/PatientRequest.java
src/main/java/org/example/backend/patient/PatientResponse.java
src/main/java/org/example/backend/patient/PatientRepository.java
src/main/java/org/example/backend/patient/PatientService.java
src/main/java/org/example/backend/patient/PatientController.java
```

## Patient Entity

```java
package org.example.backend.patient;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;

    protected Patient() {
    }

    public Patient(
            String firstName,
            String lastName,
            LocalDate dateOfBirth,
            String gender,
            String email,
            String phoneNumber
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void updateFrom(PatientRequest request) {
        this.firstName = request.firstName();
        this.lastName = request.lastName();
        this.dateOfBirth = request.dateOfBirth();
        this.gender = request.gender();
        this.email = request.email();
        this.phoneNumber = request.phoneNumber();
    }
}
```

## Request DTO

```java
package org.example.backend.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PatientRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotNull LocalDate dateOfBirth,
        @NotBlank String gender,
        @NotBlank @Email String email,
        String phoneNumber
) {
}
```

## Response DTO

```java
package org.example.backend.patient;

import java.time.LocalDate;

public record PatientResponse(
        Long id,
        String firstName,
        String lastName,
        LocalDate dateOfBirth,
        String gender,
        String email,
        String phoneNumber
) {
    static PatientResponse from(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getDateOfBirth(),
                patient.getGender(),
                patient.getEmail(),
                patient.getPhoneNumber()
        );
    }
}
```

## Repository

```java
package org.example.backend.patient;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByEmail(String email);
}
```

## Service

```java
package org.example.backend.patient;

import org.example.backend.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PatientService {
    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional
    public PatientResponse create(PatientRequest request) {
        if (patientRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Patient email already exists");
        }

        Patient patient = new Patient(
                request.firstName(),
                request.lastName(),
                request.dateOfBirth(),
                request.gender(),
                request.email(),
                request.phoneNumber()
        );

        return PatientResponse.from(patientRepository.save(patient));
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
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));

        return PatientResponse.from(patient);
    }

    @Transactional
    public PatientResponse update(Long id, PatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));

        patient.updateFrom(request);
        return PatientResponse.from(patient);
    }

    @Transactional
    public void delete(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found: " + id);
        }

        patientRepository.deleteById(id);
    }
}
```

## Controller

```java
package org.example.backend.patient;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse create(@Valid @RequestBody PatientRequest request) {
        return patientService.create(request);
    }

    @GetMapping
    public List<PatientResponse> findAll() {
        return patientService.findAll();
    }

    @GetMapping("/{id}")
    public PatientResponse findById(@PathVariable Long id) {
        return patientService.findById(id);
    }

    @PutMapping("/{id}")
    public PatientResponse update(@PathVariable Long id, @Valid @RequestBody PatientRequest request) {
        return patientService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        patientService.delete(id);
    }
}
```

## Why These Files Exist

| File | Responsibility |
| --- | --- |
| `Patient` | Database mapping |
| `PatientRequest` | Incoming patient JSON |
| `PatientResponse` | Outgoing patient JSON |
| `PatientRepository` | Stored patient operations |
| `PatientService` | Patient rules and transactions |
| `PatientController` | HTTP endpoint mapping |

## Test Manually

Create patient request:

```powershell
$body = @{
    firstName = "Asha"
    lastName = "Sharma"
    dateOfBirth = "1998-05-14"
    gender = "Female"
    email = "asha.sharma@example.com"
    phoneNumber = "9999999999"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:8080/api/patients" `
    -ContentType "application/json" `
    -Body $body
```

Read patients:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/patients"
```

Inspect MySQL:

```sql
SELECT * FROM patients;
```

## Improvement Exercise

The update method should reject changing one patient's email to another
patient's existing email. Add that rule after basic CRUD works.
