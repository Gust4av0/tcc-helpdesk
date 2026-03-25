import swaggerJSDoc from "swagger-jsdoc";

// URL dinâmica (local vs produção)
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://tcc-helpdesk-backend.onrender.com/api"
    : "http://localhost:3000/api";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API HelpDesk",
      version: "1.0.0",
      description: "Documentação da API do sistema de chamados",
    },
    servers: [
      {
        url: baseUrl,
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
