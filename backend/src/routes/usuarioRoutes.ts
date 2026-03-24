import { Router } from "express";
import {
  criarUsuario,
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from "../controllers/usuarioController";

const router = Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios);
router.get("/:id", buscarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", deletarUsuario);

export default router;
