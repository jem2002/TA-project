# Parking Management API Documentation

## Overview

The Parking Management API provides comprehensive functionality for managing parking companies, locations, and users with role-based access control. This RESTful API supports multi-tenant operations with secure JWT-based authentication.

## Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://api.parkingmanagement.com`

## Authentication

All endpoints except authentication endpoints require a valid JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <jwt-token>
\`\`\`

## User Roles

1. **GENERAL_ADMIN**: System-wide access to all resources
2. **COMPANY_ADMIN**: Full access to their company's resources
3. **SUPERVISOR**: Access to assigned parking locations
4. **OPERATOR**: Limited access to assigned parking locations
5. **CLIENT**: Access to their own data only

## API Endpoints

### Company Management

#### Create Company
- **POST** `/api/companies`
- **Access**: GENERAL_ADMIN only
- **Description**: Creates a new parking company

**Request Body:**
\`\`\`json
{
  "name": "ParkTech Solutions",
  "description": "Leading parking management company",
  "address": "123 Business Ave, Tech City, TC 12345",
  "phone": "+1-555-0123",
  "email": "info@parktech.com",
  "website": "https://parktech.com"
}
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "status": "success",
  "code": 201,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "ParkTech Solutions",
    "description": "Leading parking management company",
    "address": "123 Business Ave, Tech City, TC 12345",
    "phone": "+1-555-0123",
    "email": "info@parktech.com",
    "website": "https://parktech.com",
    "isActive": true,
    "createdAt": "2023-12-01T10:30:00Z",
    "updatedAt": "2023-12-01T10:30:00Z"
  },
  "message": "Company created successfully"
}
\`\`\`

#### Get All Companies
- **GET** `/api/companies`
- **Access**: GENERAL_ADMIN only
- **Description**: Retrieves a paginated list of all companies

**Query Parameters:**
- `page` (int, default: 0): Page number (0-based)
- `limit` (int, default: 20): Number of items per page
- `search` (string, optional): Search term for company name or description
- `isActive` (boolean, optional): Filter by active status
- `sortBy` (string, default: "name"): Sort field
- `sortOrder` (string, default: "asc"): Sort direction (asc/desc)

**Success Response (200):**
\`\`\`json
{
  "status": "success",
  "code": 200,
  "data": {
    "content": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "ParkTech Solutions",
        "description": "Leading parking management company",
        "address": "123 Business Ave, Tech City, TC 12345",
        "phone": "+1-555-0123",
        "email": "info@parktech.com",
        "website": "https://parktech.com",
        "isActive": true,
        "createdAt": "2023-12-01T10:30:00Z",
        "updatedAt": "2023-12-01T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 0,
      "limit": 20,
      "pages": 2
    }
  },
  "message": "Companies retrieved successfully"
}
\`\`\`

#### Get Company by ID
- **GET** `/api/companies/{id}`
- **Access**: GENERAL_ADMIN or COMPANY_ADMIN (own company only)
- **Description**: Retrieves detailed information about a specific company

**Success Response (200):**
\`\`\`json
{
  "status": "success",
  "code": 200,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "ParkTech Solutions",
    "description": "Leading parking management company",
    "address": "123 Business Ave, Tech City, TC 12345",
    "phone": "+1-555-0123",
    "email": "info@parktech.com",
    "website": "https://parktech.com",
    "isActive": true,
    "createdAt": "2023-12-01T10:30:00Z",
    "updatedAt": "2023-12-01T10:30:00Z",
    "stats": {
      "totalParkings": 5,
      "totalParkingSpaces": 0,
      "activeUsers": 15
    }
  },
  "message": "Company retrieved successfully"
}
\`\`\`

#### Update Company
- **PUT** `/api/companies/{id}`
- **Access**: GENERAL_ADMIN only
- **Description**: Updates an existing company

**Request Body:**
\`\`\`json
{
  "name": "ParkTech Solutions Inc",
  "description": "Updated description",
  "address": "456 New Address Blvd, Tech City, TC 12345",
  "phone": "+1-555-9876",
  "email": "new-contact@parktech.com",
  "website": "https://parktech-solutions.com",
  "isActive": true
}
\`\`\`

#### Delete Company
- **DELETE** `/api/companies/{id}`
- **Access**: GENERAL_ADMIN only
- **Description**: Soft deletes a company (sets isActive to false)

**Success Response (200):**
\`\`\`json
{
  "status": "success",
  "code": 200,
  "data": null,
  "message": "Company deleted successfully"
}
\`\`\`

### Parking Management

#### Create Parking Location
- **POST** `/api/parkings`
- **Access**: GENERAL_ADMIN or COMPANY_ADMIN
- **Description**: Creates a new parking location

**Request Body:**
\`\`\`json
{
  "companyId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Downtown Garage",
  "description": "Central parking facility",
  "address": "123 Main St, Downtown, City, State 12345",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "totalFloors": 3,
  "totalCapacity": 150,
  "operatingHoursStart": "07:00",
  "operatingHoursEnd": "22:00"
}
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "status": "success",
  "code": 201,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "companyId": "123e4567-e89b-12d3-a456-426614174000",
    "companyName": "ParkTech Solutions",
    "name": "Downtown Garage",
    "description": "Central parking facility",
    "address": "123 Main St, Downtown, City, State 12345",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "totalFloors": 3,
    "totalCapacity": 150,
    "operatingHoursStart": "07:00",
    "operatingHoursEnd": "22:00",
    "isActive": true,
    "createdAt": "2023-12-01T11:00:00Z",
    "updatedAt": "2023-12-01T11:00:00Z"
  },
  "message": "Parking location created successfully"
}
\`\`\`

#### Get All Parking Locations
- **GET** `/api/parkings`
- **Access**: GENERAL_ADMIN only
- **Description**: Retrieves a paginated list of all parking locations

**Query Parameters:**
- `page` (int, default: 0): Page number (0-based)
- `limit` (int, default: 20): Number of items per page
- `search` (string, optional): Search term for parking name or description
- `companyId` (UUID, optional): Filter by company ID
- `isActive` (boolean, optional): Filter by active status
- `sortBy` (string, default: "name"): Sort field
- `sortOrder` (string, default: "asc"): Sort direction (asc/desc)

#### Get Parkings by Company
- **GET** `/api/parkings/company/{companyId}`
- **Access**: GENERAL_ADMIN or COMPANY_ADMIN (own company only)
- **Description**: Retrieves parking locations for a specific company

#### Get Parking by ID
- **GET** `/api/parkings/{id}`
- **Access**: GENERAL_ADMIN, COMPANY_ADMIN, SUPERVISOR, OPERATOR
- **Description**: Retrieves detailed information about a specific parking location

**Success Response (200):**
\`\`\`json
{
  "status": "success",
  "code": 200,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "companyId": "123e4567-e89b-12d3-a456-426614174000",
    "companyName": "ParkTech Solutions",
    "name": "Downtown Garage",
    "description": "Central parking facility",
    "address": "123 Main St, Downtown, City, State 12345",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "totalFloors": 3,
    "totalCapacity": 150,
    "operatingHoursStart": "07:00",
    "operatingHoursEnd": "22:00",
    "isActive": true,
    "createdAt": "2023-12-01T11:00:00Z",
    "updatedAt": "2023-12-01T11:00:00Z",
    "stats": {
      "totalSpaces": 0,
      "availableSpaces": 0,
      "occupiedSpaces": 0,
      "reservedSpaces": 0,
      "maintenanceSpaces": 0,
      "occupancyRate": 0.0
    }
  },
  "message": "Parking location retrieved successfully"
}
\`\`\`

#### Update Parking Location
- **PUT** `/api/parkings/{id}`
- **Access**: GENERAL_ADMIN or COMPANY_ADMIN
- **Description**: Updates an existing parking location

**Request Body:**
\`\`\`json
{
  "name": "Downtown Premium Garage",
  "description": "Updated central parking facility",
  "address": "123 Main St, Downtown, City, State 12345",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "totalFloors": 4,
  "totalCapacity": 200,
  "operatingHoursStart": "06:00",
  "operatingHoursEnd": "23:00",
  "isActive": true
}
\`\`\`

#### Delete Parking Location
- **DELETE** `/api/parkings/{id}`
- **Access**: GENERAL_ADMIN or COMPANY_ADMIN
- **Description**: Soft deletes a parking location

## Error Responses

### Standard Error Format
\`\`\`json
{
  "status": "error",
  "code": 400,
  "error": {
    "type": "ValidationError",
    "message": "Invalid input data",
    "details": {
      "name": "Company name is required",
      "email": "Invalid email format"
    }
  }
}
\`\`\`

### Common Error Types

#### 400 Bad Request - ValidationError
\`\`\`json
{
  "status": "error",
  "code": 400,
  "error": {
    "type": "ValidationError",
    "message": "Invalid input data",
    "details": {
      "name": "Company name must be between 2 and 255 characters",
      "phone": "Invalid phone number format"
    }
  }
}
\`\`\`

#### 401 Unauthorized - AuthenticationError
\`\`\`json
{
  "status": "error",
  "code": 401,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid or expired token"
  }
}
\`\`\`

#### 403 Forbidden - AuthorizationError
\`\`\`json
{
  "status": "error",
  "code": 403,
  "error": {
    "type": "AuthorizationError",
    "message": "Insufficient permissions"
  }
}
\`\`\`

#### 404 Not Found - NotFoundError
\`\`\`json
{
  "status": "error",
  "code": 404,
  "error": {
    "type": "NotFoundError",
    "message": "Company not found"
  }
}
\`\`\`

#### 409 Conflict - ConflictError
\`\`\`json
{
  "status": "error",
  "code": 409,
  "error": {
    "type": "ConflictError",
    "message": "Company with this name already exists"
  }
}
\`\`\`

## Data Validation Rules

### Company Validation
- **name**: Required, 2-255 characters
- **description**: Optional, max 1000 characters
- **address**: Required, 10-500 characters
- **phone**: Optional, valid international phone format
- **email**: Optional, valid email format
- **website**: Optional, valid URL format

### Parking Validation
- **name**: Required, 2-255 characters
- **description**: Optional, max 1000 characters
- **address**: Required, 10-500 characters
- **latitude**: Optional, -90.0 to 90.0
- **longitude**: Optional, -180.0 to 180.0
- **totalFloors**: Optional, positive integer, max 50
- **totalCapacity**: Optional, positive integer, max 10,000
- **operatingHours**: Optional, valid time format, start ≠ end

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP address
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## API Versioning

The API uses URL versioning. Current version is `v1` (implicit in current URLs).
Future versions will be accessible via `/api/v2/` prefix.

## SDKs and Tools

### Swagger/OpenAPI
- **Development**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

### Postman Collection
A comprehensive Postman collection is available with pre-configured requests and environment variables.

## Support

For API support and questions:
- **Email**: support@parkingmanagement.com
- **Documentation**: [API Documentation Portal]
- **Status Page**: [System Status]
\`\`\`

Finally, let's create a performance monitoring configuration:
