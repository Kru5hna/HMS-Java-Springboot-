# Hospital Management Spring Boot Course Map

This folder is a topic-by-topic course for learning Spring Boot by building the
backend for a hospital management frontend.

Use one project example throughout the course:

```text
Frontend patient form
   |
   | JSON over HTTP
   v
Spring Boot patient API
   |
   v
Spring service and repository
   |
   v
MySQL hospital_management database
```

The first end-to-end milestone is:

```text
Create a patient in the frontend -> save it in MySQL -> read it back in the frontend
```

## Course Map

Study the documents in this order.

| Step | Topic | Document | Outcome |
| --- | --- | --- | --- |
| 1 | Backend foundations | [01-backend-foundations.md](01-backend-foundations.md) | Understand APIs, JSON, layers, and SQL responsibilities |
| 2 | Spring Boot project and REST | [02-spring-boot-project-and-rest.md](02-spring-boot-project-and-rest.md) | Read this Maven project and build REST endpoints |
| 3 | Database setup and JPA | [03-database-setup-and-jpa.md](03-database-setup-and-jpa.md) | Connect Spring Boot to MySQL |
| 4 | Patient CRUD API | [04-patient-crud-api.md](04-patient-crud-api.md) | Build the first complete hospital feature |
| 5 | Frontend integration | [05-frontend-integration-and-cors.md](05-frontend-integration-and-cors.md) | Call backend APIs from the frontend |
| 6 | Hospital domain modeling | [06-hospital-domain-modeling.md](06-hospital-domain-modeling.md) | Add doctors and appointments with relationships |
| 7 | Validation, errors, and tests | [07-validation-errors-tests-debugging.md](07-validation-errors-tests-debugging.md) | Make the API easier to trust and debug |
| 8 | Security and production habits | [08-security-and-production.md](08-security-and-production.md) | Learn what changes before real data is exposed |
| 9 | Practice plan | [09-exercises-and-checklist.md](09-exercises-and-checklist.md) | Track exercises and the first milestone |

## Recommended Build Order

Do not build every hospital module before one flow works.

1. Create a demo REST endpoint.
2. Connect Spring Boot to MySQL.
3. Build patient create and patient list APIs.
4. Connect the frontend patient form and list.
5. Add update and delete.
6. Add doctor CRUD.
7. Add appointment creation and lookup.
8. Add validation, tests, migrations, and security.

## Project Context

The current workspace already has:

- A Maven project in the repository root
- Java 17 configured in `pom.xml`
- Spring Boot `4.0.6`
- Application package `org.example.backend`
- Main class at `src/main/java/org/example/backend/BackendApplication.java`
- `application.properties` at `src/main/resources/application.properties`

The current `pom.xml` already has the Spring MVC web dependency. Later course
steps add Spring Data JPA, the SQL driver, and validation support.

## Hospital Modules You Will Learn Toward

Start small and grow the model:

| Module | Main responsibility |
| --- | --- |
| Patients | Patient registration and lookup |
| Doctors | Doctor profiles and specializations |
| Appointments | Patient-doctor scheduling |
| Users and roles | Login and authorization |
| Prescriptions | Doctor-created medical instructions |
| Billing | Charges, payments, and invoices |

## Course Rules

- The frontend calls backend APIs. It does not connect to the database.
- Controllers handle HTTP, services handle business rules, repositories handle data access.
- DTOs define API JSON contracts.
- Entities define persistence mapping.
- Start with one correct vertical slice, then repeat the pattern.
- Treat hospital data as sensitive even while learning.

## Official References

Use the official docs when a Spring feature or version changes:

- Spring Boot reference: https://docs.spring.io/spring-boot/reference/
- SQL database reference: https://docs.spring.io/spring-boot/reference/data/sql.html
- MySQL guide: https://spring.io/guides/gs/accessing-data-mysql/
- JPA guide: https://spring.io/guides/gs/accessing-data-jpa/
- Spring MVC CORS reference: https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html
