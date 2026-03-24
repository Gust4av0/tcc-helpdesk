import { Router } from "express";
import {
  criarMensagem,
  listarMensagens,
} from "../controllers/chamadoMensagemController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarTipo } from "../middlewares/permissaoMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  verificarTipo(["CLIENTE", "SUPORTE", "ADMIN"]),
  criarMensagem,
);

router.get(
  "/:chamado_id",
  authMiddleware,
  verificarTipo(["CLIENTE", "SUPORTE", "ADMIN"]),
  listarMensagens,
);

export default router;
