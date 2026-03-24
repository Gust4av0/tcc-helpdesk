import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes";
import categoriaRoutes from "./categoriaRoutes";
import chamadoRoutes from "./chamadoRoutes";
import chamadoMensagemRoutes from "./chamadoMensagemRoutes";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/chamados", chamadoRoutes);
router.use("/mensagens", chamadoMensagemRoutes);

export default router;
