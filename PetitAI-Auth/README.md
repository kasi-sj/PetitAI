# PetitAI-Auth

- PetitAI-Auth is a module within the PetitAI project, designed to handle authentication and authorization functionalities.
- Email notification service for login, signup, and verification flows.

## Features

- User authentication and authorization mechanisms.
- Integration with various identity providers.
- Secure token management.

## Prerequisites

- Java Development Kit (JDK) 8 or higher.
- Maven 3.6 or higher.
- Docker (optional, for containerized deployment).

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kasi-sj/PetitAI.git
   cd PetitAI/PetitAI-Auth
   ```

2. **Build the project using Maven**:

   ```bash
   ./mvnw clean install
   ```

   This command uses the Maven Wrapper (`mvnw`) to ensure the correct Maven version is used.

## Usage

1. **Run the application**:

   ```bash
   ./mvnw spring-boot:run
   ```

   This command starts the Spring Boot application.

2. **Access the application**:

   Navigate to `http://localhost:8080` in your web browser to access the authentication services.

## Configuration

Configuration settings can be adjusted in the `application.properties` or `application.yml` file located in the `src/main/resources` directory. These settings include database connections, security parameters, and other application-specific configurations.


## License

This project is licensed under the MIT License.
