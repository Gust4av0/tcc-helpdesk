import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes";
import categoriaRoutes from "./categoriaRoutes";
import chamadoRoutes from "./chamadoRoutes";
import chamadoMensagemRoutes from "./chamadoMensagemRoutes";
import authRoutes from "./authRoutes";
import chamadoLogsRoutes from "./chamadoLogsRoutes";
import dashboardRoutes from "./dashboardRoutes";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/chamados", chamadoRoutes);
router.use("/mensagens", chamadoMensagemRoutes);
router.use("/auth", authRoutes);
router.use("/chamado-logs", chamadoLogsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
