import { Router } from "express";
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, criarUsuario);
router.get("/", authMiddleware, listarUsuarios);
router.get("/:id", authMiddleware, buscarUsuario);
router.put("/:id", authMiddleware, atualizarUsuario);
router.delete("/:id", authMiddleware, deletarUsuario);

export default router;
