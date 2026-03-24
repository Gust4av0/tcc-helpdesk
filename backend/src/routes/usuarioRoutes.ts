import { Router } from "express";
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarTipo } from "../middlewares/permissaoMiddleware";

const router = Router();

router.post("/", authMiddleware, verificarTipo(["ADMIN"]), criarUsuario);

router.get("/", authMiddleware, verificarTipo(["ADMIN"]), listarUsuarios);

router.get("/:id", authMiddleware, verificarTipo(["ADMIN"]), buscarUsuario);

router.put("/:id", authMiddleware, verificarTipo(["ADMIN"]), atualizarUsuario);

router.delete("/:id", authMiddleware, verificarTipo(["ADMIN"]), deletarUsuario);

export default router;
