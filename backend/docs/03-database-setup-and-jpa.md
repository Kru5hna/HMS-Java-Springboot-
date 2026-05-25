# 03. Database Setup and JPA

This topic connects the Spring Boot backend to MySQL.

## Goal

By the end of this topic, you should understand:

- Database credentials and JDBC URLs
- Which Maven dependencies add SQL support
- What JPA entities and repositories do
- Which database settings are acceptable for learning versus production

## Choose a SQL Database

This course uses MySQL:

```text
hospital_management
```

PostgreSQL is also a strong SQL choice. H2 can be useful for experiments and
tests, but the main course flow uses a real MySQL connection.

## Prepare MySQL

Create a database and an application user:

```sql
CREATE DATABASE hospital_management;

CREATE USER 'hospital_app'@'localhost' IDENTIFIED BY 'change_this_password';

GRANT ALL PRIVILEGES ON hospital_management.* TO 'hospital_app'@'localhost';

FLUSH PRIVILEGES;
```

Use a dedicated database account for the app rather than your admin account.

## Add Dependencies

Add these dependencies in `pom.xml`:

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

Purpose:

| Dependency | Purpose |
| --- | --- |
| `spring-boot-starter-data-jpa` | JPA, Hibernate, repositories, persistence setup |
| `mysql-connector-j` | JDBC driver for MySQL |
| `spring-boot-starter-validation` | Validation annotations for request DTOs |

PostgreSQL driver alternative:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

## Configure `application.properties`

Update:

```text
src/main/resources/application.properties
```

Learning configuration:

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

## Configuration Meaning

| Property | Meaning |
| --- | --- |
| `spring.datasource.url` | JDBC database location |
| `spring.datasource.username` | Database account |
| `spring.datasource.password` | Database password |
| `spring.jpa.hibernate.ddl-auto` | Schema behavior while app starts |
| `spring.jpa.show-sql` | Print generated SQL while learning |
| `spring.jpa.open-in-view` | Avoid web-layer lazy database access |

## Local Credentials in PowerShell

Set environment variables for the terminal session:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/hospital_management"
$env:DB_USERNAME="hospital_app"
$env:DB_PASSWORD="your_local_password"
```

Do not put real production passwords into frontend code or committed source.

## Entity Mapping

A JPA entity maps Java data to a table:

```java
@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
```

Concept mapping:

| Java | SQL |
| --- | --- |
| `Patient` entity | `patients` table |
| `id` field | Primary key column |
| `@Column(nullable = false)` | Not-null database column |

## Repository Basics

Spring Data JPA generates common data operations:

```java
public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByEmail(String email);
}
```

This gives you methods such as:

- `save`
- `findAll`
- `findById`
- `existsById`
- `deleteById`

The derived method `existsByEmail` is inferred from the entity field name.

## Learning Schema Strategy

During learning:

```properties
spring.jpa.hibernate.ddl-auto=update
```

This can create or change tables from your entity mapping while you iterate.

For production:

- Use Flyway or Liquibase migrations.
- Review schema changes explicitly.
- Avoid relying on automatic production table mutation.

## Verify the Connection

Run:

```powershell
.\mvnw.cmd spring-boot:run
```

If Spring Boot starts with JPA dependencies and database configuration, read the
startup logs for connection or schema problems.

Common failures:

| Failure | Check |
| --- | --- |
| Access denied | Username and password |
| Unknown database | Database name and creation |
| Connection failure | MySQL service and port |
| Driver problem | SQL driver dependency |

## Practice

1. Add JPA, MySQL, and validation dependencies.
2. Configure the MySQL properties.
3. Start MySQL.
4. Start Spring Boot.
5. Explain the difference between an entity and a repository.
