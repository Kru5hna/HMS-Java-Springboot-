# Backend Deployment Checklist

## Runtime Profiles

- `dev` profile is default (`spring.profiles.default=dev`).
- `prod` profile is required for deployment.

## Production Environment Variables

Set these variables before starting the backend in production:

- `SPRING_PROFILES_ACTIVE=prod`
- `SERVER_PORT=8080` (or your platform port)
- `DB_URL=jdbc:postgresql://<host>:5432/hospital_management`
- `DB_USERNAME=<database_user>`
- `DB_PASSWORD=<database_password>`
- `CORS_ALLOWED_ORIGINS=https://<frontend-domain>`

Reference template: `.env.prod.example`.

## Database

- PostgreSQL driver is configured in `pom.xml`.
- Flyway migrations run automatically at startup from `classpath:db/migration`.
- JPA is set to `validate` in production, so schema must match migrations.

## Security Notes

- This backend currently has no authentication or authorization layer.
- Deploying without auth is only acceptable in trusted internal/private networks.
- For internet-facing deployment, add JWT or session-based authentication first.

## Health Checks

- Health endpoint: `/actuator/health`
- Info endpoint: `/actuator/info`

## Build And Run

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-25"
$env:SPRING_PROFILES_ACTIVE="prod"
$env:DB_URL="jdbc:postgresql://localhost:5432/hospital_management"
$env:DB_USERNAME="hospital_app"
$env:DB_PASSWORD="change_me"
$env:CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com"
.\mvnw.cmd spring-boot:run
```

Or package and run:

```powershell
.\mvnw.cmd clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
