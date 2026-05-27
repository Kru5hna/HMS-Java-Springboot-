# Hospital Management System Microservices Plan

## Scope Rule
- All new backend work is limited to the `Microservices` folder until explicitly changed.
- Current execution scope is strictly limited to **Phase 1** and **Phase 2** only.
- No implementation should import, copy, or depend on code from non-`Microservices` folders.

## Target Architecture (Phase-wise)
- `api-gateway`: single entry point for clients
- `eureka-server`: service discovery registry
- `auth-service`: login, registration, JWT, roles
- `patient-service`: patient profile and records
- `doctor-service`: doctor profile and availability
- `appointment-service`: appointment lifecycle
- `billing-service`: invoices and payment tracking
- `pharmacy-service` (later): medicine stock and issue

## Core Principles
- One service = one responsibility
- One service = one database schema
- Services communicate via REST APIs (then OpenFeign)
- Shared concerns (auth/routing/config) are centralized
- Build incrementally, validate each step before adding next service

## Recommended Build Order
1. `eureka-server`
2. `api-gateway`
3. `auth-service`
4. `patient-service`
5. `doctor-service`
6. `appointment-service`
7. `billing-service`
8. `pharmacy-service` (optional in v1)

## Phase Plan

### Phase 1: Foundation
Deliverables:
- Create parent workspace structure under `Microservices/`
- Bootstrap `eureka-server` on port `8761`
- Bootstrap `api-gateway` on port `8080`
- Register gateway with Eureka
- Add basic health/test endpoint conventions

Exit Criteria:
- Eureka dashboard accessible
- Gateway starts successfully and appears in Eureka

### Phase 2: Auth Service (First Business Service)
Deliverables:
- Create `auth-service` on port `8081`
- Add entities: `User`, `Role`
- Add auth APIs: register/login
- Add JWT generation and validation
- Register with Eureka
- Add service database: `auth_db`

Exit Criteria:
- `/auth/register` and `/auth/login` work
- JWT token issued and validated for protected endpoint

### Phase 3: Patient Service (Deferred)
Deliverables:
- Create `patient-service` on port `8082`
- CRUD APIs for patient records
- Register with Eureka
- Add service database: `patient_db`
- Secure endpoints using JWT (through gateway/security layer)

Exit Criteria:
- Patient CRUD works with authenticated access

### Phase 4: Doctor + Appointment Services (Deferred)
Deliverables:
- `doctor-service` on port `8083`
- `appointment-service` on port `8084`
- Appointment service calls patient and doctor services
- Introduce OpenFeign for inter-service calls

Exit Criteria:
- Appointment booking validates patient and doctor existence

### Phase 5: Billing Service (Deferred)
Deliverables:
- `billing-service` on port `8085`
- Generate bill against appointment
- Add service database: `billing_db`

Exit Criteria:
- Billing flow works end-to-end for an appointment

### Phase 6: Hardening and Deployment Basics (Deferred)
Deliverables:
- Centralized config strategy (Config Server or environment-based)
- Dockerfile for each service
- `docker-compose.yml` for local multi-service run
- Basic logging and error response standardization

Exit Criteria:
- Core services run via Docker Compose

## Proposed Folder Layout
```text
Microservices/
├── api-gateway/
├── eureka-server/
├── auth-service/
├── patient-service/
├── doctor-service/
├── appointment-service/
├── billing-service/
├── pharmacy-service/
└── MICROSERVICES_PLAN.md
```

## Port Allocation
- `api-gateway`: `8080`
- `auth-service`: `8081`
- `patient-service`: `8082`
- `doctor-service`: `8083`
- `appointment-service`: `8084`
- `billing-service`: `8085`
- `pharmacy-service`: `8086`
- `eureka-server`: `8761`

## Database Allocation
- `auth-service` -> `auth_db`
- `patient-service` -> `patient_db`
- `doctor-service` -> `doctor_db`
- `appointment-service` -> `appointment_db`
- `billing-service` -> `billing_db`
- `pharmacy-service` -> `pharmacy_db`

## v1 API Conventions
- Base route by service context (`/auth`, `/patients`, `/doctors`, etc.)
- `GET /actuator/health` for health checks
- Standard JSON error format (timestamp, code, message, path)
- DTO-based request/response contracts (no direct entity exposure)

## Immediate Next Tasks (Execution Queue)
1. Create `eureka-server` project skeleton.
2. Create `api-gateway` project skeleton and connect to Eureka.
3. Create `auth-service` skeleton with `/test` endpoint.
4. Verify all three services start and register in Eureka.
