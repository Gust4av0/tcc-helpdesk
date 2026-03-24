import { Router } from "express";
import {
  criarChamado,
  listarChamados,
  buscarChamado,
  atualizarChamado,
  deletarChamado,
  atribuirChamado,
} from "../controllers/chamadoController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarTipo } from "../middlewares/permissaoMiddleware";

const router = Router();

// LISTAR → qualquer usuário logado
router.get("/", authMiddleware, listarChamados);

// CRIAR → qualquer usuário logado
router.post("/", authMiddleware, criarChamado);

// ATUALIZAR → só suporte ou admin
router.put(
  "/:id",
  authMiddleware,
  verificarTipo(["SUPORTE", "ADMIN"]),
  atualizarChamado,
);

// DELETAR → só admin
router.delete("/:id", authMiddleware, verificarTipo(["ADMIN"]), deletarChamado);

// BUSCAR 1 → qualquer logado
router.get("/:id", authMiddleware, buscarChamado);

// ATRIBUIR → só suporte ou admin
router.put(
  "/:id/atribuir",
  authMiddleware,
  verificarTipo(["SUPORTE", "ADMIN"]),
  atribuirChamado,
);

export default router;
