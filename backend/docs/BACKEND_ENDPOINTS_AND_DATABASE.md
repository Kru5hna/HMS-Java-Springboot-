# Backend Endpoints and Database Plan

This document describes the backend API and database direction for the current
Hospital Management System workspace.

## Current Status

The project is already shaped like a full stack application:

- `frontend/` is a React and Vite user interface.
- `backend/` is a Spring Boot application.

The frontend still uses mock state, but the backend API and H2 persistence layer
are now ready for frontend integration.

Current backend facts:

- Spring Boot controllers exist for patients, doctors, appointments, beds, and
  activities.
- JPA entities and repositories persist those resources into the local H2
  database.
- Startup seed data mirrors the frontend's current patient, doctor,
  appointment, bed, and activity examples.
- Local CORS is enabled for the Vite frontend origins on ports `5173` and
  `5174`.

Current frontend facts:

- Patients, doctors, beds, appointments, and activity feed data come from
  `frontend/src/data/mockData.js`.
- Changes such as registering a patient, discharging a patient, adding a
  prescription, changing doctor availability, booking appointments, and marking
  beds clean are held in React state only.
- Refreshing the page resets those changes because they are not stored by the
  backend yet.

## Database Recommendation

Use a SQL database because the app has related records:

- A patient can have appointments and prescriptions.
- A doctor can be assigned to appointments and patients.
- A bed belongs to a ward and may be occupied by a patient.
- Hospital workflows benefit from validation and transactions.

### Recommended Main Database: PostgreSQL

Use PostgreSQL for the backend that you intend to keep building.

Why:

- It is a real server database used for application data, not only temporary
  demo data.
- It fits Spring Boot, JPA, relational tables, foreign keys, and transactions.
- Learning PostgreSQL teaches SQL skills that transfer well to backend work.

Some older learning notes in this backend docs folder use MySQL examples. Pick
one main database for the application rather than mixing both. This document
recommends PostgreSQL for the next backend implementation pass.

### Easiest Practice Database: H2

H2 is easier for a first experiment because it can run inside the Spring Boot
app with little setup. It is useful for quick learning and tests.

For this project, the practical choice is:

1. Use H2 now while learning the backend and wiring the frontend.
2. Move to PostgreSQL when the API flow is understood and the project needs a
   more production-like database.

Do not put a database password in frontend code. The frontend should call HTTP
endpoints. Only the backend should know database credentials.

## Backend Dependencies To Add

The current `pom.xml` has these backend persistence dependencies.

Current H2 and JPA setup:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-h2console</artifactId>
    <scope>runtime</scope>
</dependency>
```

Purpose:

| Dependency | Reason |
| --- | --- |
| `spring-boot-starter-data-jpa` | Entities, repositories, transactions, Hibernate integration |
| `spring-boot-starter-validation` | Request validation such as required fields |
| `h2` | Embedded H2 database driver |
| `spring-boot-h2console` | Browser console for the H2 database |

## Current H2 Connection Setup

The current local properties are:

```properties
spring.datasource.url=jdbc:h2:file:./data/hospital_management
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

When the backend runs, the H2 console is available at `/h2-console`.

## PostgreSQL Connection Setup

Create a local PostgreSQL database and app user:

```sql
CREATE USER hospital_app WITH PASSWORD 'change_this_password';
CREATE DATABASE hospital_management OWNER hospital_app;
```

Configure `backend/src/main/resources/application.properties` like this while
learning:

```properties
spring.application.name=backend

spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/hospital_management}
spring.datasource.username=${DB_USERNAME:hospital_app}
spring.datasource.password=${DB_PASSWORD:change_this_password}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false
```

PowerShell environment variables for a local run:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/hospital_management"
$env:DB_USERNAME="hospital_app"
$env:DB_PASSWORD="your_local_password"
```

Notes:

- `ddl-auto=update` is acceptable while learning and iterating locally.
- Use migrations such as Flyway or Liquibase before treating the schema as
  production-ready.
- Keep secrets in backend environment variables or local configuration, not in
  React files.

## Suggested Core Tables

Start small. The first useful schema can be:

| Table | Main Purpose |
| --- | --- |
| `patients` | Patient profile, admission status, contact, diagnosis |
| `doctors` | Doctor profile, specialty, availability |
| `appointments` | Patient and doctor scheduling |
| `beds` | Ward bed identity and current status |
| `prescriptions` | Prescription notes for a patient |
| `activities` | Optional audit-style dashboard feed |

Suggested relationships:

- `appointments.patient_id` references `patients.id`.
- `appointments.doctor_id` references `doctors.id`.
- `patients.doctor_id` can reference `doctors.id` for the current assigned
  doctor.
- `patients.bed_id` can reference `beds.id` for a current admitted bed.
- `prescriptions.patient_id` references `patients.id`.

## API Base URL

Use this base path for REST endpoints:

```text
/api
```

During local development, the frontend should call the backend running at:

```text
http://localhost:8081/api
```

## Endpoint Status

### Implemented Endpoints

Implemented:

- Patient CRUD, discharge, and prescription endpoints.
- Doctor CRUD and status endpoint.
- Appointment CRUD and status endpoint.
- Bed list, detail, status, and cleaning completion endpoints.
- Activity feed list endpoint.

### Implemented Endpoint Contract

These endpoints match the workflows already visible in the frontend.

## Patients

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/patients` | List patients |
| `GET` | `/api/patients/{id}` | Get one patient |
| `POST` | `/api/patients` | Register a patient |
| `PUT` | `/api/patients/{id}` | Update patient profile |
| `PATCH` | `/api/patients/{id}/discharge` | Discharge patient and release bed |
| `POST` | `/api/patients/{id}/prescriptions` | Add a prescription |

Suggested patient create request:

```json
{
  "name": "Asha Sharma",
  "age": 28,
  "gender": "Female",
  "bloodGroup": "O+",
  "contact": "9999999999",
  "department": "General Medicine",
  "status": "Outpatient",
  "bedId": null,
  "doctorName": "Dr. Maria Santos",
  "diagnosis": "Seasonal allergy review"
}
```

Suggested patient response:

```json
{
  "id": 1,
  "name": "Asha Sharma",
  "age": 28,
  "gender": "Female",
  "bloodGroup": "O+",
  "contact": "9999999999",
  "department": "General Medicine",
  "status": "Outpatient",
  "bedId": null,
  "doctor": {
    "id": 5,
    "name": "Dr. Maria Santos"
  },
  "checkInDate": "2026-05-21",
  "diagnosis": "Seasonal allergy review",
  "prescriptions": []
}
```

## Doctors

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/doctors` | List doctors |
| `GET` | `/api/doctors/{id}` | Get one doctor |
| `POST` | `/api/doctors` | Add a doctor |
| `PUT` | `/api/doctors/{id}` | Update doctor profile |
| `PATCH` | `/api/doctors/{id}/status` | Change availability status |

Suggested doctor status request:

```json
{
  "status": "Available"
}
```

## Appointments

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/appointments` | List appointments |
| `GET` | `/api/appointments/{id}` | Get one appointment |
| `POST` | `/api/appointments` | Book an appointment |
| `PUT` | `/api/appointments/{id}` | Reschedule or edit appointment |
| `PATCH` | `/api/appointments/{id}/status` | Confirm, complete, or cancel appointment |

Suggested appointment create request:

```json
{
  "patientId": 1,
  "doctorId": 1,
  "date": "2026-05-22",
  "time": "10:30",
  "reason": "Follow-up review"
}
```

## Beds and Wards

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/beds` | List beds for the ward board |
| `GET` | `/api/beds/{id}` | Get one bed |
| `PATCH` | `/api/beds/{id}/status` | Mark available, occupied, or cleaning |
| `PATCH` | `/api/beds/{id}/cleaning-complete` | Mark a cleaned bed available |

Optional later endpoint:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/wards` | List wards with bed summaries |

## Dashboard

Do not build the dashboard endpoint first. The dashboard can initially be built
from patients, doctors, beds, appointments, and activities endpoints.

Optional later endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/activities` | Latest activity feed |
| `GET` | `/api/dashboard/summary` | Aggregated dashboard counts |

## Recommended Implementation Order

Build in this order:

1. PostgreSQL connection and JPA dependencies.
2. Patient entity, repository, service, controller, and validation.
3. Patient CRUD endpoints: `POST`, `GET`, `GET by id`, `PUT`.
4. Frontend patient list and registration calls to the backend.
5. Doctors and appointments.
6. Beds, admission, discharge, and bed cleaning state transitions.
7. Prescriptions and activity feed.

This order gives the frontend a real persisted workflow early without forcing
every hospital feature into the first backend pass.

## Full Stack Answer

Yes, this is a full stack app structure:

- React frontend for the interface.
- Spring Boot backend for HTTP endpoints and business rules.
- PostgreSQL database for persisted application data.

Right now it is not fully connected full stack behavior yet because the React
frontend still uses mock data and the Spring Boot backend has no API or database
connection. The next step is to implement the first backend feature and replace
one slice of mock frontend state with real API calls.
