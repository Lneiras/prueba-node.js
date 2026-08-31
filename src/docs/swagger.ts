import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RiwiMediCare Plus API",
      version: "1.0.0",
      description: "API REST prueba de desempeño",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", example: "Admin" },
            email: { type: "string", example: "admin@riwimedicare.com" },
            password: { type: "string", example: "123456" },
            role: {
              type: "string",
              enum: ["ADMIN", "MANAGER"],
              example: "ADMIN",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@riwimedicare.com" },
            password: { type: "string", example: "123456" },
          },
        },
        RequestCreate: {
          type: "object",
          required: ["clinicId", "medicineId", "quantity", "warehouseId"],
          properties: {
            clinicId: { type: "integer", example: 1 },
            medicineId: { type: "integer", example: 1 },
            quantity: { type: "integer", example: 10 },
            warehouseId: { type: "integer", example: 1 },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "APPROVED",
                "REJECTED",
                "COMPLETED",
                "CANCELLED",
              ],
              example: "PENDING",
            },
          },
        },
      },
    },
  },
  apis: ["./src/docs/swaggerRoutes.ts"],
};
