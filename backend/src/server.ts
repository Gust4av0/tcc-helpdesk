import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./routes";
import sequelize from "./config/database";
import { seed } from "./database/seed";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

// CORS (liberado para testes e front)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Rotas da API
app.use("/api", routes);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check (Render usa isso)
app.get("/health", (req, res) => {
  res.send("OK");
});

// Inicialização do servidor
const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado com sucesso");

    await sequelize.sync();
    console.log("Banco sincronizado");

    await seed();
    console.log("Seed executado");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
};

iniciarServidor();