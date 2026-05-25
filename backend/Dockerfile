# Stage 1: Build the JAR inside the container
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
ENV MAVEN_OPTS="-Xmx300m -XX:MaxMetaspaceSize=128m"
RUN mvn clean package -DskipTests

# Stage 2: Run the compiled JAR
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]