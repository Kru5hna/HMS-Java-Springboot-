# 02. Spring Boot Project and REST

This topic introduces Spring Boot through the current project and a small REST
endpoint before database work starts.

## Goal

By the end of this topic, you should understand:

- The important files in this Maven project
- What `@SpringBootApplication` does at a high level
- How controllers expose JSON endpoints
- Why dependency injection matters

## Current Project Files

Important files already in this workspace:

```text
pom.xml
src/main/java/org/example/backend/BackendApplication.java
src/main/resources/application.properties
src/test/java/org/example/backend/BackendApplicationTests.java
```

`pom.xml` contains dependencies and build plugins. `BackendApplication.java`
starts the Spring Boot application.

Current main class shape:

```java
package org.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
```

Keep feature packages under `org.example.backend` so Spring can discover them
from the main application package.

## What Spring Boot Gives You

Spring Boot reads dependencies and configuration to prepare the application.
With the web dependency present, it can start an HTTP application and route
requests to Spring MVC controllers.

## Beans and Dependency Injection

A Spring-managed object is commonly called a bean.

Common application beans:

- `@RestController`
- `@Service`
- `@Repository`
- `@Configuration`

Use constructor injection:

```java
@Service
public class PatientService {
    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }
}
```

Spring supplies the repository dependency when it creates the service.

## First REST Endpoint

Create a small controller while learning:

```text
src/main/java/org/example/backend/patient/PatientDemoController.java
```

```java
package org.example.backend.patient;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo")
public class PatientDemoController {
    @GetMapping("/patient")
    public DemoPatient patient() {
        return new DemoPatient(1L, "Asha", "Sharma");
    }

    public record DemoPatient(Long id, String firstName, String lastName) {
    }
}
```

Expected route:

```text
GET http://localhost:8080/api/demo/patient
```

Expected JSON:

```json
{
  "id": 1,
  "firstName": "Asha",
  "lastName": "Sharma"
}
```

This endpoint has no database yet. It proves the HTTP and JSON part of the
backend works.

## Controller Annotations

| Annotation | Purpose |
| --- | --- |
| `@RestController` | Return response bodies such as JSON |
| `@RequestMapping` | Set a base URL |
| `@GetMapping` | Handle GET requests |
| `@PostMapping` | Handle POST requests |
| `@RequestBody` | Read JSON body into Java |
| `@PathVariable` | Read a value from the URL path |

## POST Shape Without a Database

This is the shape you will later use for patient creation:

```java
@PostMapping("/patients")
public PatientResponse create(@RequestBody PatientRequest request) {
    return patientService.create(request);
}
```

The controller should stay thin. It receives HTTP data and delegates to a
service.

## Run the Backend

From the project root:

```powershell
.\mvnw.cmd spring-boot:run
```

The usual local backend URL is:

```text
http://localhost:8080
```

If another process already uses port `8080`, configure:

```properties
server.port=8081
```

## Recommended Package Structure

Use feature folders:

```text
org.example.backend
|-- BackendApplication.java
|-- config
|-- common
|-- patient
|-- doctor
|-- appointment
```

Patient code stays in `patient`, doctor code stays in `doctor`, and reusable
error or configuration code goes in `common` or `config`.

## Learning Note About This Project

The current `pom.xml` contains JavaFX dependencies. A browser frontend calling a
Spring REST API does not require JavaFX. Leave it alone while learning unless it
gets in the way, then review whether the project still needs it.

## Practice

1. Run the project.
2. Add the demo patient endpoint.
3. Call it from the browser or PowerShell.
4. Explain which part converts the Java record into JSON.
