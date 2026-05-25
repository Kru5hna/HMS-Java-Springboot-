# 01. Backend Foundations

This topic explains what the backend does before you start writing Spring Boot
code.

## Goal

By the end of this topic, you should be able to explain:

- Why a frontend needs a backend
- Why the frontend should not connect directly to MySQL
- What HTTP, JSON, SQL, and backend layers each do
- What the first hospital backend milestone should be

## The Hospital Flow

For patient registration, the system should work like this:

```text
Patient form in frontend
   |
   | POST /api/patients
   | JSON request body
   v
Spring Boot backend
   |
   | SQL through JPA/Hibernate
   v
patients table in MySQL
```

When the frontend shows a patient list:

```text
Frontend patient list
   |
   | GET /api/patients
   v
Spring Boot backend
   |
   v
MySQL
```

## What the Frontend Owns

The frontend should handle:

- Forms
- Tables and screens
- Loading and error UI
- Sending request JSON
- Displaying response JSON

Example request data from the frontend:

```json
{
  "firstName": "Asha",
  "lastName": "Sharma",
  "dateOfBirth": "1998-05-14",
  "gender": "Female",
  "email": "asha.sharma@example.com",
  "phoneNumber": "9999999999"
}
```

## What the Backend Owns

The backend should handle:

- API routes
- Validation
- Business rules
- Data access
- Authentication and authorization
- Database transactions
- Error responses

Examples of backend rules:

- Patient email must be valid.
- A doctor ID must exist before an appointment is saved.
- A patient must not see another patient's private data.

## What the Database Owns

The database persists structured data.

Hospital starter tables:

| Table | Purpose |
| --- | --- |
| `patients` | Patient identity and contact details |
| `doctors` | Doctor profile and specialization |
| `appointments` | Scheduled patient-doctor meetings |

You need SQL basics:

```sql
SELECT * FROM patients;

INSERT INTO patients (first_name, last_name, email)
VALUES ('Asha', 'Sharma', 'asha.sharma@example.com');
```

Spring Data JPA will generate many SQL operations for you, but learning SQL
still matters because the data is stored in relational tables.

## HTTP Basics

REST APIs use HTTP methods:

| Method | Meaning in this course |
| --- | --- |
| `GET` | Read data |
| `POST` | Create data |
| `PUT` | Update data |
| `DELETE` | Delete data |

Patient API examples:

| Method | URL | Purpose |
| --- | --- | --- |
| `POST` | `/api/patients` | Create patient |
| `GET` | `/api/patients` | List patients |
| `GET` | `/api/patients/1` | Read patient with ID 1 |

## JSON Basics

The frontend and backend will mostly exchange JSON.

Request JSON goes into the backend:

```json
{
  "email": "asha.sharma@example.com"
}
```

Response JSON comes out of the backend:

```json
{
  "id": 1,
  "email": "asha.sharma@example.com"
}
```

The response usually includes database-generated information such as `id`.

## The Layered Backend Shape

Use layers so responsibilities stay clear:

```text
Controller -> Service -> Repository -> Database
```

| Layer | Hospital example |
| --- | --- |
| Controller | Receives `POST /api/patients` |
| Service | Checks rules before saving patient |
| Repository | Saves patient entity |
| Database | Stores row in `patients` |

## Core Vocabulary

| Term | Meaning |
| --- | --- |
| API | Backend interface the frontend calls |
| Endpoint | One API route such as `GET /api/patients` |
| DTO | Java type used for API request or response JSON |
| Entity | Java type mapped to a database table |
| Repository | Data access interface |
| Service | Business logic class |
| Controller | HTTP request handler |

## First Milestone

Your first backend milestone is deliberately small:

1. Frontend sends patient JSON.
2. Spring Boot validates and saves it.
3. MySQL stores it.
4. Spring Boot returns patient JSON.
5. Frontend renders the saved patient.

## Before You Continue

Make sure you can answer:

- What does `POST /api/patients` mean?
- Which layer should check appointment business rules?
- Why should database credentials stay out of frontend code?
