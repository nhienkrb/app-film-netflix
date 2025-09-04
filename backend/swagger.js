const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0", // version OpenAPI
    info: {
      title: "My API Docs App Film", // tiêu đề tài liệu
      version: "1.0.0",
      description: "API documentation for my Node.js project Film",
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1", // base URL cho API
      },
    ],
      components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    //  security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  apis: ["./src/routes/*.js"], // chỉ định nơi swagger tìm JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
