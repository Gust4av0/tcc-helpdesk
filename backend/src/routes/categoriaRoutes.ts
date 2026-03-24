import { Router } from "express";
import {
  criarCategoria,
  listarCategorias,
  buscarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarTipo } from "../middlewares/permissaoMiddleware";

const router = Router();

router.post("/", authMiddleware, verificarTipo(["ADMIN"]), criarCategoria);
router.get("/", authMiddleware, listarCategorias); // todos podem ver
router.get("/:id", authMiddleware, buscarCategoria); // todos podem ver
router.put(
  "/:id",
  authMiddleware,
  verificarTipo(["ADMIN"]),
  atualizarCategoria,
);
router.delete(
  "/:id",
  authMiddleware,
  verificarTipo(["ADMIN"]),
  deletarCategoria,
);

export default router;
