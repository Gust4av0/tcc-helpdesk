import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes";
import categoriaRoutes from "./categoriaRoutes";
import chamadoRoutes from "./chamadoRoutes";
import chamadoMensagemRoutes from "./chamadoMensagemRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/chamados", chamadoRoutes);
router.use("/mensagens", chamadoMensagemRoutes);
router.use("/auth", authRoutes);

export default router;
