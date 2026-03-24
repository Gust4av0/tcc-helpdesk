import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "./routes";
import sequelize from "./config/database";
import { seed } from "./database/seed";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// testando conexão
sequelize
  .authenticate()
  .then(() => {
    console.log("Banco conectado com sucesso");
  })
  .catch((erro) => {
    console.log("Erro ao conectar:", erro);
  });


sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco sincronizado!");
  });


sequelize.sync({ alter: true }).then(async () => {
  console.log("Banco pronto!");
  await seed();
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
