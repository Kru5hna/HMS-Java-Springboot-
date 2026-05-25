# Spring Boot Backend Learning Guide for a Hospital Management System

This guide has now been split into a topic-based course under `docs`.
Start with `docs/README.md` for the course map and study order.

This guide is a learning path and a build plan for turning an existing hospital
management frontend into a Spring Boot backend connected to a SQL database.

The examples use:

- Java 17
- Maven
- Spring Boot
- Spring MVC REST APIs
- Spring Data JPA and Hibernate
- MySQL as the main database example

Your current project already has a Spring Boot application entry point at:

```text
src/main/java/org/example/backend/BackendApplication.java
```

It also already has a Maven `pom.xml` and the Spring MVC web dependency. The
next steps are to learn the backend layers, add database dependencies, connect a
database, create REST APIs, and call those APIs from the frontend.

## 1. What You Are Building

Your frontend should not connect directly to the database.

Use this flow:

```text
Frontend UI
   |
   | HTTP requests with JSON
   v
Spring Boot Controller
   |
   v
Service layer
   |
   v
Repository layer
   |
   v
SQL database
```

For a hospital management system, the backend may eventually expose APIs for:

- Patients
- Doctors
- Appointments
- Departments
- Prescriptions
- Billing
- Rooms and admissions
- Users, roles, login, and authorization

Do not build all modules at once. First make one complete vertical slice:

```text
Create patient -> store patient in MySQL -> read patient from API -> show patient in frontend
```

Once that works, repeat the same pattern for doctors and appointments.

## 2. Learning Roadmap

Learn Spring Boot in this order:

1. Java backend basics
2. Spring Boot project structure
3. REST APIs with Spring MVC
4. Dependency injection and layers
5. SQL database basics
6. JPA entities and repositories
7. DTOs, validation, and error handling
8. Frontend API calls and CORS
9. Relationships such as patient-to-appointment
10. Testing
11. Security and production database migrations

### Skills You Need Before Spring Boot

Be comfortable with:

- Java classes, interfaces, constructors, packages, collections, and exceptions
- Maven dependencies and `pom.xml`
- HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- JSON request and response bodies
- SQL basics: tables, primary keys, foreign keys, `SELECT`, `INSERT`, `UPDATE`, `DELETE`

## 3. Core Spring Boot Concepts

### Spring Boot

Spring Boot starts a Spring application with sensible defaults based on the
dependencies in the project. For example, when the web dependency is present,
you can create REST controllers and run an HTTP server.

### Bean

A bean is an object managed by Spring. Common annotations that create or
configure beans are:

- `@RestController`
- `@Service`
- `@Repository`
- `@Configuration`

### Dependency Injection

Instead of manually creating every object with `new`, Spring supplies the
objects a class needs.

Prefer constructor injection:

```java
@Service
public class PatientService {
    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }
}
```

### Controller

A controller receives HTTP requests and returns HTTP responses.

Example responsibilities:

- Accept `/api/patients`
- Read JSON input
- Call the service layer
- Return JSON output and an HTTP status code

### Service

A service contains business logic.

Example responsibilities:

- Check whether an email already exists
- Apply rules before saving an appointment
- Decide what happens when a patient is missing

### Repository

A repository talks to stored data. Spring Data JPA can generate common database
operations from repository interfaces.

### Entity

An entity is a Java class mapped to a database table.

Example:

```text
Patient entity <-> patients table
```

### DTO

A DTO, or Data Transfer Object, is the JSON shape used at the API boundary.

Do not expose every database entity directly from every API. DTOs help you:

- Hide internal fields
- Validate request bodies
- Keep frontend contracts stable while database design evolves

## 4. Read the Current Project

Current project observations:

- The app package is `org.example.backend`.
- The app uses Maven.
- The app currently has a Spring MVC dependency.
- The current `application.properties` only sets the application name.
- The `pom.xml` currently includes JavaFX dependencies. JavaFX is not required
  for a browser frontend talking to a Spring Boot REST backend.

For now, you can leave unrelated dependencies alone while learning. Later, if
this backend is only an HTTP API for a web frontend, review whether the JavaFX
dependencies and plugin are still needed.

## 5. Choose the Database

This guide uses MySQL because it is common for learning SQL-backed Spring Boot
applications.

Other valid choices:

- PostgreSQL: strong default for many production systems
- H2: useful for simple tests and temporary local experiments

The backend layering is almost the same whichever SQL database you choose. The
driver dependency and JDBC URL change.

## 6. Prepare MySQL

Install MySQL locally or run it through Docker. For first learning steps, a local
MySQL server is enough.

Create a database and a dedicated user:

```sql
CREATE DATABASE hospital_management;

CREATE USER 'hospital_app'@'localhost' IDENTIFIED BY 'change_this_password';

GRANT ALL PRIVILEGES ON hospital_management.* TO 'hospital_app'@'localhost';

FLUSH PRIVILEGES;
```

Do not keep real passwords in source control. The examples below use environment
variables for credentials.

## 7. Add Backend Dependencies

Your current `pom.xml` already has the web starter. Add the database and
validation dependencies inside `<dependencies>`.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Why these dependencies matter:

- `spring-boot-starter-data-jpa` gives you Spring Data JPA and Hibernate support.
- `mysql-connector-j` lets the Java app connect to MySQL over JDBC.
- `spring-boot-starter-validation` enables request validation annotations such
  as `@NotBlank` and `@Email`.

If you use PostgreSQL instead of MySQL, replace the MySQL driver with:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

## 8. Configure the Database Connection

Update:

```text
src/main/resources/application.properties
```

Learning configuration for MySQL:

```properties
spring.application.name=backend

spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/hospital_management}
spring.datasource.username=${DB_USERNAME:hospital_app}
spring.datasource.password=${DB_PASSWORD:change_this_password}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false
```

Meaning of the important values:

- `spring.datasource.url` identifies the database server and database name.
- `spring.datasource.username` and `spring.datasource.password` are database credentials.
- `spring.jpa.hibernate.ddl-auto=update` lets Hibernate update tables while you
  are learning.
- `spring.jpa.show-sql=true` prints SQL generated by Hibernate during learning.
- `spring.jpa.open-in-view=false` pushes database access into the service layer
  instead of letting web rendering trigger lazy loads later.

Important rule:

- `ddl-auto=update` is convenient while learning.
- For production, use a migration tool such as Flyway or Liquibase and move
  away from relying on Hibernate to change production tables automatically.

### PowerShell Environment Variables

Before starting the app, you can set credentials for the current terminal:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/hospital_management"
$env:DB_USERNAME="hospital_app"
$env:DB_PASSWORD="your_local_password"
```

## 9. Use a Layered Package Structure

Create packages under `org.example.backend` like this:

```text
org.example.backend
|-- BackendApplication.java
|-- config
|-- patient
|   |-- Patient.java
|   |-- PatientController.java
|   |-- PatientRepository.java
|   |-- PatientService.java
|   |-- PatientRequest.java
|   |-- PatientResponse.java
|-- common
    |-- ApiError.java
    |-- GlobalExceptionHandler.java
    |-- ResourceNotFoundException.java
```

This is a feature-oriented structure. Patient code stays close together. As the
project grows, `doctor`, `appointment`, and `billing` can follow the same shape.

## 10. Build the First Feature: Patients

### Step 10.1: Create the Patient Entity

Create:

```text
src/main/java/org/example/backend/patient/Patient.java
```

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

    public void updateFrom(
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
}
```

Key ideas:

- `@Entity` says this class is stored with JPA.
- `@Table(name = "patients")` sets the SQL table name.
- `@Id` marks the primary key.
- `@GeneratedValue` lets the database generate the numeric ID.
- A protected no-argument constructor is needed by JPA.

### Step 10.2: Create Request and Response DTOs

Create:

```text
src/main/java/org/example/backend/patient/PatientRequest.java
```

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

Create:

```text
src/main/java/org/example/backend/patient/PatientResponse.java
```

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

Records are concise DTOs. They are suitable when the DTO mainly carries data.

### Step 10.3: Create the Repository

Create:

```text
src/main/java/org/example/backend/patient/PatientRepository.java
```

```java
package org.example.backend.patient;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByEmail(String email);
}
```

You do not manually implement `save`, `findAll`, `findById`, or `deleteById`.
Spring Data JPA provides them.

### Step 10.4: Create Common Exceptions

Create:

```text
src/main/java/org/example/backend/common/ResourceNotFoundException.java
```

```java
package org.example.backend.common;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

Create:

```text
src/main/java/org/example/backend/common/ApiError.java
```

```java
package org.example.backend.common;

import java.time.Instant;

public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message
) {
}
```

Create:

```text
src/main/java/org/example/backend/common/GlobalExceptionHandler.java
```

```java
package org.example.backend.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException exception) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return error(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseEntity<ApiError> error(HttpStatus status, String message) {
        ApiError body = new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message
        );

        return ResponseEntity.status(status).body(body);
    }
}
```

Without explicit error handling, beginners often get confusing frontend failures.
Make errors predictable early.

### Step 10.5: Create the Service

Create:

```text
src/main/java/org/example/backend/patient/PatientService.java
```

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

        patient.updateFrom(
                request.firstName(),
                request.lastName(),
                request.dateOfBirth(),
                request.gender(),
                request.email(),
                request.phoneNumber()
        );

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

Notice that business decisions live here, not in the controller.

One improvement to make later:

- The update method should also guard against changing a patient email to an
  email already used by another patient.

### Step 10.6: Create the REST Controller

Create:

```text
src/main/java/org/example/backend/patient/PatientController.java
```

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

Now the first API contract is:

| Method | URL | Purpose |
| --- | --- | --- |
| `POST` | `/api/patients` | Create a patient |
| `GET` | `/api/patients` | Read all patients |
| `GET` | `/api/patients/{id}` | Read one patient |
| `PUT` | `/api/patients/{id}` | Update one patient |
| `DELETE` | `/api/patients/{id}` | Delete one patient |

## 11. Start the Backend

From the project root:

```powershell
.\mvnw.cmd spring-boot:run
```

The usual local backend URL is:

```text
http://localhost:8080
```

At startup, check for:

- No database connection errors
- Hibernate SQL output while learning
- The application listening on the expected port

Common startup failures:

| Problem | Likely cause |
| --- | --- |
| `Access denied for user` | Wrong DB username or password |
| `Unknown database` | Database was not created |
| `Communications link failure` | MySQL server is not running or port is wrong |
| Table not found | Schema creation or migration did not run |
| Port 8080 already in use | Another app is already using the port |

To use another port:

```properties
server.port=8081
```

## 12. Test the API Before Connecting the Frontend

Do not debug frontend and backend at the same time at first. Verify the backend
API directly.

### Create a Patient with PowerShell

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

### Read Patients

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/patients"
```

### Expected JSON Shape

```json
{
  "id": 1,
  "firstName": "Asha",
  "lastName": "Sharma",
  "dateOfBirth": "1998-05-14",
  "gender": "Female",
  "email": "asha.sharma@example.com",
  "phoneNumber": "9999999999"
}
```

Also inspect MySQL:

```sql
SELECT * FROM patients;
```

If the API returns the patient and the SQL table contains the row, the backend
to database connection works.

## 13. Connect the Frontend to the Backend

The frontend should call REST endpoints with HTTP.

Example `fetch` function:

```javascript
export async function createPatient(patient) {
  const response = await fetch("http://localhost:8080/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(patient)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Could not create patient");
  }

  return response.json();
}
```

Example patient payload:

```javascript
const patient = {
  firstName: "Asha",
  lastName: "Sharma",
  dateOfBirth: "1998-05-14",
  gender: "Female",
  email: "asha.sharma@example.com",
  phoneNumber: "9999999999"
};
```

Frontend screens should usually have:

- Loading state
- Success state
- Empty state for lists
- Error state when the backend returns a failure

## 14. Configure CORS for Local Frontend Development

If the frontend runs at one origin and the backend runs at another origin, the
browser may block API calls until CORS is configured.

Example:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

Create:

```text
src/main/java/org/example/backend/config/WebConfig.java
```

```java
package org.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

Adjust `allowedOrigins` to the real frontend development URL. Do not leave
unnecessary origins enabled in production.

## 15. Hospital Database Design Starter

Start with a small model:

```text
patients
doctors
appointments
```

Suggested appointment relation:

```text
One patient can have many appointments.
One doctor can have many appointments.
Each appointment belongs to one patient and one doctor.
```

Basic table idea:

| Table | Important columns |
| --- | --- |
| `patients` | `id`, name, date of birth, gender, email, phone |
| `doctors` | `id`, name, specialization, email, phone |
| `appointments` | `id`, `patient_id`, `doctor_id`, appointment time, status, notes |

Keep medical and security concerns in mind:

- Treat patient information as sensitive.
- Do not log passwords, tokens, or private medical details carelessly.
- Add authentication and authorization before exposing real data to real users.

## 16. Example Relationship: Appointment

An appointment entity will need foreign key relationships.

Simplified shape:

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

Learning rule for relationships:

- Store relationships in entities.
- Use DTOs to decide what JSON the frontend receives.
- Avoid returning huge nested entity graphs by accident.

## 17. Build Modules in This Order

Suggested implementation sequence:

1. Patient CRUD
2. Doctor CRUD
3. Appointment creation
4. Appointment list by patient
5. Appointment list by doctor
6. Appointment reschedule and cancel rules
7. User login and roles
8. Billing and prescriptions after the core workflows are stable

## 18. REST API Design Rules

Use nouns in URLs:

```text
/api/patients
/api/doctors
/api/appointments
```

Use HTTP methods for actions:

| Action | Method |
| --- | --- |
| Create | `POST` |
| Read | `GET` |
| Replace/update | `PUT` |
| Partial update if you support it | `PATCH` |
| Delete | `DELETE` |

Use meaningful status codes:

| Situation | Status |
| --- | --- |
| Created successfully | `201 Created` |
| Read/update successfully | `200 OK` |
| Delete successfully without body | `204 No Content` |
| Invalid request | `400 Bad Request` |
| Not logged in | `401 Unauthorized` |
| Logged in but forbidden | `403 Forbidden` |
| Missing resource | `404 Not Found` |
| Duplicate unique data | Often `409 Conflict` |

## 19. Validation Rules to Add Early

Examples:

- Patient first and last names cannot be blank.
- Email must be valid.
- Doctor specialization cannot be blank.
- Appointment time must be in the future for new appointments.
- A doctor should not have overlapping appointments if that is a business rule.

Validation belongs in two places:

- DTO annotations for request shape rules
- Service layer for business rules that need database checks or domain logic

## 20. Testing Strategy

Start with focused tests.

### Controller Tests

Verify:

- Request mapping
- Validation responses
- JSON shape
- Status codes

### Service Tests

Verify:

- Business rules
- Duplicate data checks
- Missing ID behavior

### Repository Tests

Verify custom queries and relationships.

### Integration Tests

Verify:

- Spring context starts
- Database-backed flow works
- API, service, repository, and serialization agree

At the start of the project, the first useful verification is simple:

1. Start the Spring Boot app.
2. Create a patient through the API.
3. Read the patient through the API.
4. Confirm the row exists in MySQL.

## 21. Debugging Guide

### Frontend Fails but Backend Works in PowerShell

Check:

- Browser console errors
- CORS configuration
- Exact API URL
- JSON field names
- Backend error body handling

### Backend Receives Null or Invalid Fields

Check:

- Frontend property names match DTO component names
- `Content-Type` is `application/json`
- Request date format matches expected Java type

### Database Table Is Not Updated

Check:

- The entity has `@Entity`
- The entity package is under the main application package
- The app connects to the database you are inspecting
- `ddl-auto` or migrations are configured as intended

### Infinite JSON or Large Nested Responses

Do not expose bidirectional JPA entity graphs blindly. Return DTOs designed for
the frontend screen.

## 22. Security Learning Path

Do not treat security as an optional final detail for a hospital system.

Learn it after basic CRUD works:

1. Password hashing
2. Authentication
3. Authorization
4. Roles such as admin, doctor, receptionist, and patient
5. Endpoint rules
6. Token or session strategy
7. Audit logging decisions

Example access questions:

- Can a receptionist edit a prescription?
- Can a doctor view patients outside their assigned work?
- Can a patient read another patient's appointment?

These rules belong in backend security and business logic, not only in frontend
button visibility.

## 23. Production Steps After Learning CRUD

Before treating the project as production-ready:

- Replace learning schema updates with database migrations.
- Use environment-specific configuration.
- Add authentication and authorization.
- Add indexes for important lookup fields.
- Use pagination for large lists.
- Add logging without leaking sensitive details.
- Add tests for critical workflows.
- Add database backups and recovery planning.
- Validate frontend and backend error handling together.

## 24. Mini Curriculum

### Phase 1: REST Without Database

Goal:

- Understand controllers and JSON.

Practice:

- Create `GET /api/hello`.
- Create `GET /api/patients/demo` that returns a hard-coded DTO.

### Phase 2: Database Connection

Goal:

- Understand JDBC URL, credentials, entity mapping, and repository basics.

Practice:

- Add JPA and MySQL dependencies.
- Configure `application.properties`.
- Start the app and let it connect to MySQL.

### Phase 3: Patient CRUD

Goal:

- Understand controller, service, repository, DTO, validation, and error handling.

Practice:

- Implement the patient code in this guide.
- Call it from PowerShell.
- Call it from your frontend patient form.

### Phase 4: Doctor CRUD

Goal:

- Repeat the pattern without copying blindly.

Practice:

- Decide the `Doctor` fields.
- Create DTOs.
- Add validation.
- Add frontend form and list calls.

### Phase 5: Appointments

Goal:

- Learn relationships and business rules.

Practice:

- Create appointments with `patientId` and `doctorId`.
- Load both entities in the service layer.
- Reject a missing patient or doctor.
- Return a frontend-friendly appointment response DTO.

### Phase 6: Security and Migrations

Goal:

- Move from demo CRUD to a backend with safer operational habits.

Practice:

- Learn Spring Security.
- Add role-aware endpoints.
- Learn Flyway or Liquibase.

## 25. Exercises

Complete these in order:

1. Add `GET /api/patients`.
2. Add `POST /api/patients`.
3. Store patients in MySQL.
4. Render the backend patient list in the frontend.
5. Show a useful error when email is invalid.
6. Show a useful error when an ID does not exist.
7. Add doctor CRUD.
8. Add appointment creation.
9. Prevent appointments with missing doctors or patients.
10. Add authentication before handling realistic private data.

## 26. Definition of Done for the First Backend Milestone

The first milestone is done when:

- The Spring Boot app starts locally.
- MySQL is running and configured.
- Patient data is stored in the database.
- Patient CRUD endpoints return JSON.
- Invalid patient input returns a clear error.
- The frontend patient form calls the backend instead of local mock data.
- The frontend patient list reads from the backend.
- CORS is configured for local development if frontend and backend use different origins.

## 27. Common Beginner Mistakes

- Connecting the frontend directly to the database.
- Putting SQL or repository calls directly in controllers.
- Returning entities everywhere without thinking about JSON contracts.
- Skipping validation.
- Hardcoding real database passwords in files committed to Git.
- Building every hospital module before one full feature works.
- Ignoring CORS while testing through a browser.
- Assuming frontend button hiding is backend authorization.

## 28. Suggested Next Files to Create in This Project

After adding the dependencies and properties, create:

```text
src/main/java/org/example/backend/patient/Patient.java
src/main/java/org/example/backend/patient/PatientRequest.java
src/main/java/org/example/backend/patient/PatientResponse.java
src/main/java/org/example/backend/patient/PatientRepository.java
src/main/java/org/example/backend/patient/PatientService.java
src/main/java/org/example/backend/patient/PatientController.java
src/main/java/org/example/backend/common/ResourceNotFoundException.java
src/main/java/org/example/backend/common/ApiError.java
src/main/java/org/example/backend/common/GlobalExceptionHandler.java
src/main/java/org/example/backend/config/WebConfig.java
```

## 29. Official References

Use official documentation as the source of truth when a Spring feature or
version changes:

- Spring Boot SQL database reference:
  https://docs.spring.io/spring-boot/reference/data/sql.html
- Spring guide for MySQL data access:
  https://spring.io/guides/gs/accessing-data-mysql/
- Spring guide for JPA data access:
  https://spring.io/guides/gs/accessing-data-jpa/
- Spring Framework CORS reference:
  https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html
- Spring Boot reference documentation:
  https://docs.spring.io/spring-boot/reference/

## 30. Study Checklist

Use this checklist while learning:

- [ ] I can explain what controller, service, repository, entity, and DTO mean.
- [ ] I can create a Spring MVC endpoint and return JSON.
- [ ] I can configure a MySQL connection in Spring Boot.
- [ ] I can explain what a JPA entity maps to in SQL.
- [ ] I can create and use a `JpaRepository`.
- [ ] I can validate a request DTO.
- [ ] I can return a clear error for a missing resource.
- [ ] I can call the backend from my frontend.
- [ ] I can identify and fix a local CORS problem.
- [ ] I can model a patient-doctor-appointment relationship.
- [ ] I know why production data changes should use migrations.
- [ ] I know why a hospital backend needs real authentication and authorization.
