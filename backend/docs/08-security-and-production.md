# 08. Security and Production Habits

This topic explains what changes when the hospital backend moves beyond learning
CRUD.

## Goal

Understand why a working CRUD API is not yet a real hospital backend.

## Hospital Data Is Sensitive

Treat patient data carefully:

- Do not expose it to unauthenticated users.
- Do not trust frontend button visibility as authorization.
- Do not log secrets or private details carelessly.
- Do not leave wide-open database access or origins without review.

## Security Learning Order

After basic patient CRUD works, learn:

1. Password hashing
2. Authentication
3. Authorization
4. Roles and endpoint rules
5. Session or token strategy
6. Audit-related design decisions

## Example Roles

Possible roles:

| Role | Example responsibility |
| --- | --- |
| Admin | Manage system configuration and users |
| Receptionist | Register patients and schedule appointments |
| Doctor | Read assigned patient context and write clinical data |
| Patient | Read their own permitted data |

## Backend Authorization Questions

Answer these in code and tests:

- Can a receptionist edit a prescription?
- Can a patient view another patient's appointment?
- Can a doctor cancel appointments for another department?
- Which fields are visible to each role?

## Credentials and Configuration

Use environment-specific configuration.

Avoid:

- Production passwords in committed `application.properties`
- Passwords in frontend code
- Sharing one admin database account for every environment

## Database Migrations

Learning configuration often uses:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Production systems should use explicit migrations.

Migration tools let you track changes such as:

- Create `patients`
- Add `appointments`
- Add unique email constraint
- Add indexes

Learn Flyway or Liquibase after basic CRUD works.

## Production API Habits

Add as the project grows:

- Pagination for large patient lists
- Indexes for common lookups
- Consistent error contracts
- Validation and business-rule tests
- Health and monitoring decisions
- Backup and recovery planning
- Environment-specific CORS and security settings

## Safe Logging Habits

Logs should help debugging without leaking sensitive data.

Avoid logging:

- Passwords
- Access tokens
- Full private medical notes by default
- Full request bodies without review

## Frontend and Backend Security Boundary

Frontend can improve user experience:

- Hide actions a role should not use
- Avoid displaying inaccessible screens

Backend must enforce rules:

- Reject unauthorized requests
- Validate ownership and role checks
- Protect database access paths

## Course Checkpoint

Before security work begins, you should already have:

- Patient CRUD
- Doctor CRUD or a clear doctor plan
- Appointment domain design
- DTOs and validation
- Local frontend integration
- Basic tests for important rules

## Practice

1. Write down the roles your frontend currently assumes.
2. List patient and appointment actions per role.
3. Identify which endpoints need authentication first.
4. Replace vague "admin can do everything" assumptions with explicit rules.
