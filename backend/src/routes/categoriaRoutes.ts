import { Router } from "express";
import {
  criarCategoria,
  listarCategorias,
  buscarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, criarCategoria);
router.get("/", authMiddleware, listarCategorias);
router.get("/:id", authMiddleware, buscarCategoria);
router.put("/:id", authMiddleware, atualizarCategoria);
router.delete("/:id", authMiddleware, deletarCategoria);

export default router;
