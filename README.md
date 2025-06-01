# Parking Management System API

A comprehensive Spring Boot REST API for managing parking facilities, users, and access control with role-based authentication.

## Features

- **User Management**: Complete CRUD operations for users with role-based access control
- **Authentication**: JWT-based authentication with refresh tokens
- **Role-Based Security**: Support for 5 user roles (General Admin, Company Admin, Supervisor, Operator, Client)
- **Company Management**: Multi-tenant support for parking companies
- **Password Recovery**: Secure password reset functionality
- **RESTful API**: Well-designed REST endpoints with comprehensive error handling
- **Database Integration**: PostgreSQL with JPA/Hibernate
- **Security**: BCrypt password hashing and Spring Security integration

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security 6**
- **Spring Data JPA**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **Maven**
- **Lombok**
- **MapStruct**

## User Roles

1. **General Admin**: System-wide access, can manage all companies and users
2. **Company Admin**: Full access to their company's data and users
3. **Supervisor**: Manages specific parking locations
4. **Operator**: Day-to-day operations at assigned locations
5. **Client**: Vehicle owners who use parking services

## Project Structure

\`\`\`
src/
├── main/
│   ├── java/com/parkingmanagement/
│   │   ├── config/              # Configuration classes
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── request/         # Request DTOs
│   │   │   └── response/        # Response DTOs
│   │   ├── exception/           # Custom exceptions and handlers
│   │   ├── mapper/              # MapStruct mappers
│   │   ├── model/               # JPA entities and enums
│   │   │   ├── entity/          # JPA entities
│   │   │   └── enums/           # Enumerations
│   │   ├── repository/          # JPA repositories
│   │   ├── security/            # Security components
│   │   └── service/             # Business logic services
│   └── resources/
│       ├── application.yml      # Main configuration
│       └── application-dev.yml  # Development configuration
└── test/                        # Test classes
\`\`\`

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+ (for production)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd parking-management-api
   \`\`\`

2. **Set up the database**
   \`\`\`sql
   CREATE DATABASE parking_management;
   CREATE USER parking_user WITH PASSWORD 'parking_password';
   GRANT ALL PRIVILEGES ON DATABASE parking_management TO parking_user;
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   export DB_USERNAME=parking_user
   export DB_PASSWORD=parking_password
   export JWT_SECRET=your-secret-key-here
   \`\`\`

4. **Build and run the application**
   \`\`\`bash
   mvn clean install
   mvn spring-boot:run
   \`\`\`

   Or for development with H2 database:
   \`\`\`bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   \`\`\`

### API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints except authentication require a valid JWT token.

#### Authentication Header
\`\`\`
Authorization: Bearer <jwt-token>
\`\`\`

#### Standard Response Format

**Success Response:**
\`\`\`json
{
  "status": "success",
  "code": 200,
  "data": { ... },
  "message": "Operation completed successfully"
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "status": "error",
  "code": 400,
  "error": {
    "type": "ValidationError",
    "message": "Error description",
    "details": { ... }
  }
}
\`\`\`

### API Endpoints

#### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | User registration | Admin only |
| POST | `/api/auth/password/reset-request` | Request password reset | Public |
| POST | `/api/auth/password/reset-confirm` | Confirm password reset | Public |
| POST | `/api/auth/token/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | User logout | Authenticated |

#### User Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/{id}` | Get user by ID | Admin/Self |
| PUT | `/api/users/{id}` | Update user | Admin |
| DELETE | `/api/users/{id}` | Delete user | Admin |
| GET | `/api/users/me` | Get current user | Authenticated |

### Example API Calls

#### 1. User Login
\`\`\`bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "code": 200,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "admin@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "GENERAL_ADMIN",
      "companyId": null,
      "isActive": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 86400
    }
  },
  "message": "Login successful"
}
\`\`\`

#### 2. Register New User
\`\`\`bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1-555-1234",
    "role": "COMPANY_ADMIN",
    "companyId": "123e4567-e89b-12d3-a456-426614174001"
  }'
\`\`\`

#### 3. Get All Users
\`\`\`bash
curl -X GET "http://localhost:8080/api/users?page=0&limit=20&search=john&role=COMPANY_ADMIN" \
  -H "Authorization: Bearer <jwt-token>"
\`\`\`

#### 4. Update User
\`\`\`bash
curl -X PUT http://localhost:8080/api/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{
    "firstName": "John Updated",
    "phone": "+1-555-9999",
    "isActive": true
  }'
\`\`\`

### Error Handling

The API provides comprehensive error handling with specific error types:

- **ValidationError** (400): Invalid input data
- **AuthenticationError** (401): Invalid credentials or token
- **AuthorizationError** (403): Insufficient permissions
- **NotFoundError** (404): Resource not found
- **ConflictError** (409): Resource conflict
- **InternalServerError** (500): Unexpected server error

### Security Features

1. **Password Hashing**: BCrypt with salt
2. **JWT Tokens**: Secure token-based authentication
3. **Role-Based Access Control**: Method-level security
4. **CORS Configuration**: Configurable cross-origin requests
5. **Input Validation**: Comprehensive request validation
6. **SQL Injection Protection**: JPA/Hibernate parameterized queries

### Development

#### Running Tests
\`\`\`bash
mvn test
\`\`\`

#### Code Quality
The project follows Spring Boot best practices:
- Clean architecture with separation of concerns
- Comprehensive error handling
- Input validation
- Security best practices
- Proper logging
- Transaction management

#### Database Migrations
The project uses Liquibase for database migrations. Migration files should be placed in `src/main/resources/db/changelog/`.

### Production Deployment

1. **Environment Variables**
   \`\`\`bash
   export SPRING_PROFILES_ACTIVE=prod
   export DB_USERNAME=your_db_user
   export DB_PASSWORD=your_db_password
   export JWT_SECRET=your_secure_secret_key
   export MAIL_HOST=your_smtp_host
   export MAIL_USERNAME=your_email
   export MAIL_PASSWORD=your_email_password
   \`\`\`

2. **Build for Production**
   \`\`\`bash
   mvn clean package -DskipTests
   \`\`\`

3. **Run the Application**
   \`\`\`bash
   java -jar target/parking-management-api-1.0.0.jar
   \`\`\`

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

Finally, let's create a simple test class to demonstrate the setup:
