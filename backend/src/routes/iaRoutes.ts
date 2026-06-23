import { Router } from "express";
import {
  responderSuporteIA,
  listarHistoricoIA,
  limparHistoricoIA,
} from "../controllers/iaController";
import { responderIAHelpDesk } from "../service/iaService";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/teste", async (req, res) => {
  res.json({
    mensagem: "IA funcionando",
  });
});

router.get("/teste-ia", async (req, res) => {
  try {
    const resposta = await responderIAHelpDesk(
      "Minha impressora não imprime",
      "Anderson",
    );

    res.json({
      resposta,
    });
  } catch (error) {
    console.log("[IA TESTE]", error);

    res.status(500).json({
      erro: "Erro ao consultar IA",
    });
  }
});

router.get("/historico", authMiddleware, listarHistoricoIA);
router.delete("/historico", authMiddleware, limparHistoricoIA);
router.post("/suporte", authMiddleware, responderSuporteIA);

export default router;