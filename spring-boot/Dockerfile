# Use a base image with Java
FROM maven:3.8.3-openjdk-17 as build

# Set the working directory for the container
COPY . .

RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim
# Copy the generated JAR file into the container
COPY --from=build target/spring-boot-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Xms512m", "-Xmx768m", "-jar", "app.jar"]