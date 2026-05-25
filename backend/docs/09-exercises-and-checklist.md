# 09. Exercises and Checklist

Use this document as the practical course tracker.

## Mini Curriculum

| Phase | Focus | Main outcome |
| --- | --- | --- |
| 1 | REST without database | Demo patient endpoint returns JSON |
| 2 | Database connection | Spring Boot starts against MySQL |
| 3 | Patient CRUD | Patient APIs store real data |
| 4 | Frontend integration | Frontend form and list use backend APIs |
| 5 | Doctor CRUD | Repeat the feature pattern |
| 6 | Appointments | Learn relationships and business rules |
| 7 | Quality | Validation, tests, debugging habits |
| 8 | Safety | Security and migrations |

## Ordered Exercises

1. Run the current Spring Boot project.
2. Create a demo `GET /api/demo/patient` endpoint.
3. Add JPA, MySQL, and validation dependencies.
4. Configure the `hospital_management` database connection.
5. Create the `Patient` entity.
6. Create patient request and response DTOs.
7. Create patient repository and service.
8. Create patient controller routes.
9. Create a patient through PowerShell.
10. Read the patient list through PowerShell.
11. Confirm the row in MySQL.
12. Connect the frontend patient form.
13. Connect the frontend patient list.
14. Add backend error display in the frontend.
15. Build doctor CRUD.
16. Model appointments with patient and doctor links.
17. Reject missing appointment relationships.
18. Add focused tests.
19. Learn migrations.
20. Learn authentication and authorization.

## First Milestone Definition of Done

The first milestone is done when:

- Spring Boot starts locally.
- MySQL is running locally.
- Patient data is stored in the database.
- Patient CRUD endpoints return JSON.
- Invalid patient input returns a useful error.
- Frontend patient form calls the backend.
- Frontend patient list reads from the backend.
- Local CORS is configured if browser origins differ.

## Study Checklist

- [ ] I can explain controller, service, repository, entity, and DTO.
- [ ] I can run the Maven Spring Boot project.
- [ ] I can create a REST endpoint that returns JSON.
- [ ] I can configure a MySQL connection.
- [ ] I can explain what JPA maps into SQL.
- [ ] I can use a `JpaRepository`.
- [ ] I can validate request DTO fields.
- [ ] I can return a clear missing-resource error.
- [ ] I can call the API from my frontend.
- [ ] I can diagnose a local CORS failure.
- [ ] I can model patient, doctor, and appointment relationships.
- [ ] I know why migrations matter.
- [ ] I know why hospital APIs need real backend authorization.

## Common Beginner Mistakes

- Connecting frontend code directly to the database
- Writing business rules only in frontend forms
- Putting all logic in controllers
- Returning database entities everywhere
- Skipping DTOs until JSON becomes hard to control
- Hardcoding real credentials
- Building many modules before the first complete flow works
- Treating CORS as security authorization

## Next Code Files for the Patient Milestone

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

## Recommended Next Session

After reading the first three docs, implement the database dependencies and
properties before starting patient CRUD.
