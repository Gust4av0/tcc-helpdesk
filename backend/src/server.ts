import express from "express";
import cors from "cors";
import routes from "./routes";
import sequelize from "./config/database";

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

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
