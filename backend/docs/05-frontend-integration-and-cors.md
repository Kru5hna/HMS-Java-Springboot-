# 05. Frontend Integration and CORS

This topic connects the hospital frontend to the Spring Boot patient API.

## Goal

By the end of this topic, you should be able to:

- Send patient JSON from the frontend
- Read backend error JSON
- Load patient lists
- Configure local CORS when frontend and backend use different origins

## API Boundary

The frontend should call:

```text
http://localhost:8080/api/patients
```

It should not know:

- Database password
- JPA entity implementation
- Repository code
- Table creation strategy

## Create Patient with `fetch`

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

Example input:

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

## Load Patients

```javascript
export async function getPatients() {
  const response = await fetch("http://localhost:8080/api/patients");

  if (!response.ok) {
    throw new Error("Could not load patients");
  }

  return response.json();
}
```

## UI States to Handle

Your patient screens should handle:

- Loading while a request is in progress
- Success after saving
- Empty list when there are no patients
- Error when backend validation fails
- Error when backend is offline

## Keep an API File in the Frontend

Avoid scattering hardcoded URLs across many components.

Example shape:

```text
src/api/patients.js
```

or:

```text
src/services/patientApi.js
```

That file can hold `createPatient`, `getPatients`, `updatePatient`, and
`deletePatient`.

## Local CORS Problem

The browser sees these as different origins:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
```

PowerShell may call the backend successfully while the browser blocks the same
request because browsers enforce cross-origin rules.

## Add Global CORS for API Routes

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

Change the allowed origin if the frontend dev server uses another URL.

## CORS Rules

- Allow only origins your frontend actually uses.
- Keep local and production origins separate.
- Revisit CORS when adding Spring Security.
- CORS is not authorization.

## Common Frontend Integration Bugs

| Symptom | Check |
| --- | --- |
| Request never reaches controller | API URL and browser CORS error |
| Backend fields are null | JSON property names and content type |
| Date parsing fails | Use ISO date like `1998-05-14` for `LocalDate` |
| Error message disappears | Read non-2xx response bodies |
| Duplicate rows | Submit handler firing twice |

## Practice

1. Connect the patient form to `POST /api/patients`.
2. Connect the patient table to `GET /api/patients`.
3. Show backend validation errors in the UI.
4. Stop the backend and confirm the frontend shows a network failure state.
