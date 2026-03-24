import { Router } from "express";
import {
  criarChamado,
  listarChamados,
  buscarChamado,
  atualizarChamado,
  deletarChamado,
} from "../controllers/chamadoController";
import { atribuirChamado } from "../controllers/chamadoController";

const router = Router();

router.post("/", criarChamado);
router.get("/", listarChamados);
router.get("/:id", buscarChamado);
router.put("/:id", atualizarChamado);
router.delete("/:id", deletarChamado);
router.put("/:id/atribuir", atribuirChamado);

export default router;
