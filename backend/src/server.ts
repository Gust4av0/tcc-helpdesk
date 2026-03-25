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

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const iniciarServidor = async () => {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado com sucesso");

    await sequelize.sync();
    console.log("Banco sincronizado");

    await seed();
    console.log("Seed executado");

    app.listen(process.env.PORT || 3000, () => {
      console.log("Servidor rodando na porta 3000");
    });

  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
};

iniciarServidor();