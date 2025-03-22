# Use a minimal JDK image for better performance
FROM eclipse-temurin:17-jdk

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/*.jar app.jar

# Expose the application's port
EXPOSE 8080

# Use environment variables for flexibility (optional)
ENV JAVA_OPTS=""

# Run the application with proper memory settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
