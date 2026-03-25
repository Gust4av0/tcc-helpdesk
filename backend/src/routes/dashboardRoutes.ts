import { Router } from "express";
import { dashboard } from "../controllers/dashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Obter métricas do sistema (Dashboard)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do dashboard
 *         content:
 *           application/json:
 *             example:
 *               total: 10
 *               porStatus:
 *                 NOVO: 3
 *                 ATRIBUIDO: 2
 *                 EM_ATENDIMENTO: 4
 *                 FINALIZADO: 1
 *               porPrioridade:
 *                 BAIXA: 1
 *                 MEDIA: 3
 *                 ALTA: 4
 *                 URGENTE: 2
 *               porCategoria:
 *                 - nome: "Hardware"
 *                   total: 3
 *                 - nome: "Software"
 *                   total: 5
 */
router.get("/", authMiddleware, dashboard);

export default router;