import { Router } from "express";
import {
  criarMensagem,
  listarMensagens,
} from "../controllers/chamadoMensagemController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, criarMensagem);
router.get("/:chamado_id", authMiddleware, listarMensagens);

export default router;
