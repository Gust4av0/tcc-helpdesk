import { Router } from "express";
import {
  criarCategoria,
  listarCategorias,
  buscarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController";

const router = Router();

router.post("/", criarCategoria);
router.get("/", listarCategorias);
router.get("/:id", buscarCategoria);
router.put("/:id", atualizarCategoria);
router.delete("/:id", deletarCategoria);

export default router;
