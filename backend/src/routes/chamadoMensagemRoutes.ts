import { Router } from "express";
import {
  criarMensagem,
  listarMensagens,
} from "../controllers/chamadoMensagemController";

const router = Router();

router.post("/", criarMensagem);
router.get("/:chamado_id", listarMensagens);

export default router;
