// Parking Management REST API Documentation
console.log("# PARKING MANAGEMENT REST API DOCUMENTATION\n");

// Define standard response structure
const standardResponseStructure = {
  success: {
    structure: {
      status: "success",
      code: 200, // or appropriate status code
      data: {}, // response data
      message: "Operation completed successfully"
    },
    description: "All successful responses follow this structure. The 'data' field contains the response payload."
  },
  error: {
    structure: {
      status: "error",
      code: 400, // or appropriate error code
      error: {
        type: "ValidationError", // or other error type
        message: "Error description",
        details: [] // optional array of specific error details
      }
    },
    description: "All error responses follow this structure. The 'error' field contains information about what went wrong."
  }
};

// Define API endpoints by category
const apiEndpoints = {
  // ===== AUTHENTICATION ENDPOINTS =====
  authentication: {
    title: "Authentication Endpoints",
    description: "Endpoints for user authentication and account management",
    endpoints: [
      {
        name: "User Login",
        method: "POST",
        url: "/api/auth/login",
        description: "Authenticate a user and receive an access token",
        requestBody: {
          email: "user@example.com",
          password: "password123"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            user: {
              id: "uuid-string",
              email: "user@example.com",
              firstName: "John",
              lastName: "Doe",
              role: "general_admin",
              companyId: null // null for general_admin
            },
            tokens: {
              accessToken: "jwt-token-string",
              refreshToken: "refresh-token-string",
              expiresIn: 3600 // seconds
            }
          },
          message: "Login successful"
        },
        errorResponses: [
          {
            status: "error",
            code: 401,
            error: {
              type: "AuthenticationError",
              message: "Invalid email or password"
            }
          },
          {
            status: "error",
            code: 403,
            error: {
              type: "AccountError",
              message: "Account is inactive"
            }
          }
        ]
      },
      {
        name: "User Registration",
        method: "POST",
        url: "/api/auth/register",
        description: "Register a new user (General Admin can register any user type)",
        requestBody: {
          email: "newuser@example.com",
          password: "securePassword123",
          firstName: "Jane",
          lastName: "Smith",
          phone: "+1-555-1234",
          role: "company_admin", // One of: general_admin, company_admin, supervisor, operator, client
          companyId: "uuid-string" // Optional, required for company-specific roles
        },
        successResponse: {
          status: "success",
          code: 201,
          data: {
            user: {
              id: "uuid-string",
              email: "newuser@example.com",
              firstName: "Jane",
              lastName: "Smith",
              role: "company_admin",
              companyId: "uuid-string",
              createdAt: "2023-05-15T14:30:00Z"
            }
          },
          message: "User registered successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 400,
            error: {
              type: "ValidationError",
              message: "Invalid input data",
              details: [
                {
                  field: "email",
                  message: "Email already in use"
                }
              ]
            }
          }
        ]
      },
      {
        name: "Password Reset Request",
        method: "POST",
        url: "/api/auth/password/reset-request",
        description: "Request a password reset link",
        requestBody: {
          email: "user@example.com"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {},
          message: "Password reset instructions sent to email"
        },
        errorResponses: [
          {
            status: "error",
            code: 404,
            error: {
              type: "NotFoundError",
              message: "No account found with this email"
            }
          }
        ]
      },
      {
        name: "Password Reset Confirmation",
        method: "POST",
        url: "/api/auth/password/reset-confirm",
        description: "Reset password using token received via email",
        requestBody: {
          token: "reset-token-string",
          newPassword: "newSecurePassword123"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {},
          message: "Password reset successful"
        },
        errorResponses: [
          {
            status: "error",
            code: 400,
            error: {
              type: "ValidationError",
              message: "Invalid or expired token"
            }
          }
        ]
      },
      {
        name: "Refresh Token",
        method: "POST",
        url: "/api/auth/token/refresh",
        description: "Get a new access token using refresh token",
        requestBody: {
          refreshToken: "refresh-token-string"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            tokens: {
              accessToken: "new-jwt-token-string",
              expiresIn: 3600 // seconds
            }
          },
          message: "Token refreshed successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 401,
            error: {
              type: "AuthenticationError",
              message: "Invalid or expired refresh token"
            }
          }
        ]
      },
      {
        name: "Logout",
        method: "POST",
        url: "/api/auth/logout",
        description: "Invalidate the current refresh token",
        requestBody: {
          refreshToken: "refresh-token-string"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {},
          message: "Logout successful"
        },
        errorResponses: []
      }
    ]
  },

  // ===== COMPANY MANAGEMENT ENDPOINTS =====
  companyManagement: {
    title: "Company Management Endpoints",
    description: "Endpoints for managing parking companies (General Admin access)",
    endpoints: [
      {
        name: "List All Companies",
        method: "GET",
        url: "/api/companies",
        description: "Get a list of all companies with pagination",
        queryParameters: {
          page: "1 (default)",
          limit: "20 (default)",
          search: "optional search term",
          sortBy: "name (default)",
          sortOrder: "asc (default)"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            companies: [
              {
                id: "uuid-string",
                name: "ParkTech Solutions",
                description: "Leading parking management company",
                address: "123 Business Ave, Tech City",
                phone: "+1-555-0123",
                email: "info@parktech.com",
                website: "https://parktech.com",
                isActive: true,
                createdAt: "2023-01-15T10:30:00Z",
                updatedAt: "2023-01-15T10:30:00Z"
              },
              // More companies...
            ],
            pagination: {
              total: 50,
              page: 1,
              limit: 20,
              pages: 3
            }
          },
          message: "Companies retrieved successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 403,
            error: {
              type: "AuthorizationError",
              message: "Insufficient permissions"
            }
          }
        ]
      },
      {
        name: "Get Company Details",
        method: "GET",
        url: "/api/companies/{companyId}",
        description: "Get detailed information about a specific company",
        urlParameters: {
          companyId: "UUID of the company"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            company: {
              id: "uuid-string",
              name: "ParkTech Solutions",
              description: "Leading parking management company",
              address: "123 Business Ave, Tech City",
              phone: "+1-555-0123",
              email: "info@parktech.com",
              website: "https://parktech.com",
              isActive: true,
              createdAt: "2023-01-15T10:30:00Z",
              updatedAt: "2023-01-15T10:30:00Z",
              stats: {
                totalParkings: 5,
                totalParkingSpaces: 250,
                activeUsers: 15
              }
            }
          },
          message: "Company details retrieved successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 404,
            error: {
              type: "NotFoundError",
              message: "Company not found"
            }
          }
        ]
      },
      {
        name: "Create Company",
        method: "POST",
        url: "/api/companies",
        description: "Create a new parking company",
        requestBody: {
          name: "City Parking Inc",
          description: "Urban parking solutions",
          address: "456 Downtown St, Metro City",
          phone: "+1-555-6789",
          email: "contact@cityparking.com",
          website: "https://cityparking.com"
        },
        successResponse: {
          status: "success",
          code: 201,
          data: {
            company: {
              id: "uuid-string",
              name: "City Parking Inc",
              description: "Urban parking solutions",
              address: "456 Downtown St, Metro City",
              phone: "+1-555-6789",
              email: "contact@cityparking.com",
              website: "https://cityparking.com",
              isActive: true,
              createdAt: "2023-05-15T14:30:00Z",
              updatedAt: "2023-05-15T14:30:00Z"
            }
          },
          message: "Company created successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 400,
            error: {
              type: "ValidationError",
              message: "Invalid input data",
              details: [
                {
                  field: "name",
                  message: "Name is required"
                }
              ]
            }
          }
        ]
      },
      {
        name: "Update Company",
        method: "PUT",
        url: "/api/companies/{companyId}",
        description: "Update an existing company's information",
        urlParameters: {
          companyId: "UUID of the company"
        },
        requestBody: {
          name: "City Parking Solutions Inc",
          description: "Updated description",
          address: "789 New Address Blvd, Metro City",
          phone: "+1-555-9876",
          email: "new-contact@cityparking.com",
          website: "https://cityparking-solutions.com",
          isActive: true
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            company: {
              id: "uuid-string",
              name: "City Parking Solutions Inc",
              description: "Updated description",
              address: "789 New Address Blvd, Metro City",
              phone: "+1-555-9876",
              email: "new-contact@cityparking.com",
              website: "https://cityparking-solutions.com",
              isActive: true,
              createdAt: "2023-01-15T10:30:00Z",
              updatedAt: "2023-05-15T15:45:00Z"
            }
          },
          message: "Company updated successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 404,
            error: {
              type: "NotFoundError",
              message: "Company not found"
            }
          }
        ]
      },
      {
        name: "Delete Company",
        method: "DELETE",
        url: "/api/companies/{companyId}",
        description: "Delete a company (soft delete by setting isActive to false)",
        urlParameters: {
          companyId: "UUID of the company"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {},
          message: "Company deleted successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 404,
            error: {
              type: "NotFoundError",
              message: "Company not found"
            }
          },
          {
            status: "error",
            code: 409,
            error: {
              type: "ConflictError",
              message: "Cannot delete company with active parkings"
            }
          }
        ]
      }
    ]
  },

  // ===== PARKING MANAGEMENT ENDPOINTS =====
  parkingManagement: {
    title: "Parking Management Endpoints",
    description: "Endpoints for managing parking locations (General Admin access)",
    endpoints: [
      {
        name: "List All Parkings",
        method: "GET",
        url: "/api/parkings",
        description: "Get a list of all parking locations with pagination",
        queryParameters: {
          page: "1 (default)",
          limit: "20 (default)",
          search: "optional search term",
          companyId: "optional filter by company",
          isActive: "true/false (optional)",
          sortBy: "name (default)",
          sortOrder: "asc (default)"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            parkings: [
              {
                id: "uuid-string",
                companyId: "uuid-string",
                companyName: "ParkTech Solutions",
                name: "Downtown Garage",
                description: "Central parking facility",
                address: "123 Main St, Downtown",
                latitude: 40.7128,
                longitude: -74.0060,
                totalFloors: 3,
                operatingHoursStart: "07:00",
                operatingHoursEnd: "22:00",
                isActive: true,
                createdAt: "2023-02-10T08:15:00Z",
                updatedAt: "2023-02-10T08:15:00Z"
              },
              // More parkings...
            ],
            pagination: {
              total: 25,
              page: 1,
              limit: 20,
              pages: 2
            }
          },
          message: "Parking locations retrieved successfully"
        },
        errorResponses: []
      },
      {
        name: "Get Parking Details",
        method: "GET",
        url: "/api/parkings/{parkingId}",
        description: "Get detailed information about a specific parking location",
        urlParameters: {
          parkingId: "UUID of the parking location"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            parking: {
              id: "uuid-string",
              companyId: "uuid-string",
              companyName: "ParkTech Solutions",
              name: "Downtown Garage",
              description: "Central parking facility",
              address: "123 Main St, Downtown",
              latitude: 40.7128,
              longitude: -74.0060,
              totalFloors: 3,
              operatingHoursStart: "07:00",
              operatingHoursEnd: "22:00",
              isActive: true,
              createdAt: "2023-02-10T08:15:00Z",
              updatedAt: "2023-02-10T08:15:00Z",
              stats: {
                totalSpaces: 150,
                availableSpaces: 42,
                occupiedSpaces: 98,
                reservedSpaces: 10,
                maintenanceSpaces: 0,
                spacesByType: {
                  car: 120,
                  motorcycle: 20,
                  bicycle: 10
                }
              }
            }
          },
          message: "Parking details retrieved successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 404,
            error: {
              type: "NotFoundError",
              message: "Parking location not found"
            }
          }
        ]
      },
      {
        name: "Create Parking",
        method: "POST",
        url: "/api/parkings",
        description: "Create a new parking location",
        requestBody: {
          companyId: "uuid-string",
          name: "Airport Parking",
          description: "Long-term airport parking facility",
          address: "789 Airport Road, Terminal City",
          latitude: 33.6407,
          longitude: -84.4277,
          totalFloors: 2,
          operatingHoursStart: "00:00",
          operatingHoursEnd: "23:59"
        },
        successResponse: {
          status: "success",
          code: 201,
          data: {
            parking: {
              id: "uuid-string",
              companyId: "uuid-string",
              name: "Airport Parking",
              description: "Long-term airport parking facility",
              address: "789 Airport Road, Terminal City",
              latitude: 33.6407,
              longitude: -84.4277,
              totalFloors: 2,
              operatingHoursStart: "00:00",
              operatingHoursEnd: "23:59",
              isActive: true,
              createdAt: "2023-05-15T16:20:00Z",
              updatedAt: "2023-05-15T16:20:00Z"
            }
          },
          message: "Parking location created successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 400,
            error: {
              type: "ValidationError",
              message: "Invalid input data",
              details: [
                {
                  field: "companyId",
                  message: "Company not found"
                }
              ]
            }
          }
        ]
      },
      {
        name: "Update Parking",
        method: "PUT",
        url: "/api/parkings/{parkingId}",
        description: "Update an existing parking location",
        urlParameters: {
          parkingId: "UUID of the parking location"
        },
        requestBody: {
          name: "Airport Premium Parking",
          description: "Updated description",
          address: "789 Airport Road, Terminal City",
          latitude: 33.6407,
          longitude: -84.4277,
          totalFloors: 3,
          operatingHoursStart: "05:00",
          operatingHoursEnd: "23:00",
          isActive: true
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {
            parking: {
              id: "uuid-string",
              companyId: "uuid-string",
              name: "Airport Premium Parking",
              description: "Updated description",
              address: "789 Airport Road, Terminal City",
              latitude: 33.6407,
              longitude: -84.4277,
              totalFloors: 3,
              operatingHoursStart: "05:00",
              operatingHoursEnd: "23:00",
              isActive: true,
              createdAt: "2023-02-10T08:15:00Z",
              updatedAt: "2023-05-15T17:30:00Z"
            }
          },
          message: "Parking location updated successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 404,
            error: {
              type: "NotFoundError",
              message: "Parking location not found"
            }
          }
        ]
      },
      {
        name: "Delete Parking",
        method: "DELETE",
        url: "/api/parkings/{parkingId}",
        description: "Delete a parking location (soft delete by setting isActive to false)",
        urlParameters: {
          parkingId: "UUID of the parking location"
        },
        successResponse: {
          status: "success",
          code: 200,
          data: {},
          message: "Parking location deleted successfully"
        },
        errorResponses: [
          {
            status: "error",
            code: 404,
            error: {
              type: "NotFoundError",
              message: "Parking location not found"
            }
          },
          {
            status: "error",
            code: 409,
            error: {
              type: "ConflictError",
              message: "Cannot delete parking with active spaces or reservations"
            }
          }
        ]
      }
    ]
  }
};

// Print API documentation
console.log("## Standard Response Structure\n");
console.log("### Success Response");
console.log("```json");
console.log(JSON.stringify(standardResponseStructure.success.structure, null, 2));
console.log("```");
console.log(standardResponseStructure.success.description);
console.log("\n");

console.log("### Error Response");
console.log("```json");
console.log(JSON.stringify(standardResponseStructure.error.structure, null, 2));
console.log("```");
console.log(standardResponseStructure.error.description);
console.log("\n");

// Print each category of endpoints
Object.values(apiEndpoints).forEach(category => {
  console.log(`## ${category.title}\n`);
  console.log(`${category.description}\n`);
  
  category.endpoints.forEach((endpoint, index) => {
    console.log(`### ${index + 1}. ${endpoint.name}`);
    console.log(`**Method:** ${endpoint.method}`);
    console.log(`**URL:** ${endpoint.url}`);
    console.log(`**Description:** ${endpoint.description}\n`);
    
    if (endpoint.urlParameters) {
      console.log("**URL Parameters:**");
      Object.entries(endpoint.urlParameters).forEach(([param, desc]) => {
        console.log(`- \`${param}\`: ${desc}`);
      });
      console.log("");
    }
    
    if (endpoint.queryParameters) {
      console.log("**Query Parameters:**");
      Object.entries(endpoint.queryParameters).forEach(([param, desc]) => {
        console.log(`- \`${param}\`: ${desc}`);
      });
      console.log("");
    }
    
    if (endpoint.requestBody) {
      console.log("**Request Body:**");
      console.log("```json");
      console.log(JSON.stringify(endpoint.requestBody, null, 2));
      console.log("```\n");
    }
    
    console.log("**Success Response:**");
    console.log("```json");
    console.log(JSON.stringify(endpoint.successResponse, null, 2));
    console.log("```\n");
    
    if (endpoint.errorResponses && endpoint.errorResponses.length > 0) {
      console.log("**Error Responses:**");
      endpoint.errorResponses.forEach(error => {
        console.log("```json");
        console.log(JSON.stringify(error, null, 2));
        console.log("```\n");
      });
    }
    
    console.log("---\n");
  });
});

console.log("## Authentication and Authorization\n");
console.log("All endpoints except for login, registration, and password reset require authentication via JWT token.");
console.log("Include the token in the Authorization header as follows:\n");
console.log("```");
console.log("Authorization: Bearer <jwt-token>");
console.log("```\n");

console.log("Access control is based on user roles:");
console.log("- General Admin: Full access to all endpoints");
console.log("- Company Admin: Access to their company's data only");
console.log("- Supervisor: Access to assigned parking locations only");
console.log("- Operator: Limited access to assigned parking locations");
console.log("- Client: Access to their own data only\n");

console.log("## Rate Limiting\n");
console.log("API requests are limited to 100 requests per minute per IP address.");
console.log("When rate limit is exceeded, the API will respond with status code 429 (Too Many Requests).");
