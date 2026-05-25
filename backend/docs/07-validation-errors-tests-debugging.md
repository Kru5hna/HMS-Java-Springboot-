# 07. Validation, Errors, Tests, and Debugging

This topic makes the hospital API easier to trust and easier to diagnose.

## Goal

Learn how to add:

- Request validation
- Predictable error responses
- Focused test coverage
- Debugging habits for frontend, backend, and database failures

## Request Validation

DTO validation catches invalid request shape:

```java
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

Controller method:

```java
public PatientResponse create(@Valid @RequestBody PatientRequest request) {
    return patientService.create(request);
}
```

## Domain Validation

Service rules handle logic that needs domain context.

Examples:

- Patient email uniqueness
- Doctor existence before appointment creation
- Appointment scheduling rules

Do not put every rule only in frontend form validation. Backend rules must still
protect stored data.

## Missing Resource Exception

```java
package org.example.backend.common;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

## Error Body

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

## Global Error Handler

```java
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

Add the imports shown in the patient guide when implementing the full class.

## Status Codes

| Situation | Status |
| --- | --- |
| Patient created | `201 Created` |
| Patient read | `200 OK` |
| Patient deleted without body | `204 No Content` |
| Invalid patient request | `400 Bad Request` |
| Missing patient ID | `404 Not Found` |
| Duplicate conflict | Consider `409 Conflict` |

## Testing Layers

Use tests based on risk.

| Test type | Useful checks |
| --- | --- |
| Controller test | URLs, JSON, validation, status |
| Service test | Rules and missing-resource logic |
| Repository test | Custom queries and relationships |
| Integration test | Whole request-to-database flow |

## First Useful Test Targets

Patient API:

- Valid create returns `201`
- Blank first name returns a client error
- Missing patient ID returns `404`
- List endpoint returns saved patients

Appointment API:

- Missing doctor ID is rejected
- Missing patient ID is rejected
- Valid linked appointment is saved

## Manual Debugging Sequence

When a feature fails, isolate the boundary:

1. Can the backend start?
2. Can PowerShell call the backend API?
3. Is the correct row stored in MySQL?
4. Can the browser call the backend?
5. Is the frontend sending the expected JSON?

## Common Failures

| Symptom | Likely area |
| --- | --- |
| Backend cannot start | Dependency, port, or database config |
| API works in PowerShell but not browser | CORS or frontend URL |
| Database row missing | Service or repository path |
| Request fields null | JSON field mismatch |
| Infinite nested JSON | Returning entity relationships directly |

## SQL Inspection

While learning, use SQL to verify reality:

```sql
SELECT * FROM patients;
SELECT * FROM doctors;
SELECT * FROM appointments;
```

## Practice

1. Send a patient request with an invalid email.
2. Request a missing patient ID.
3. Confirm the frontend sees a useful error.
4. Add tests around the case that failed most often.
