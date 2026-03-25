import { Router } from "express";
import ChamadoLog from "../models/ChamadoLog";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /chamado-logs/{chamado_id}:
 *   get:
 *     summary: Listar logs de um chamado
 *     tags: [Chamado Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chamado_id
 *         required: true
 *         description: ID do chamado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de logs do chamado
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 chamado_id: 3
 *                 status_anterior: "NOVO"
 *                 status_novo: "ATRIBUIDO"
 *                 usuario_id: 2
 *                 created_at: "2026-03-25T10:00:00.000Z"
 */
router.get("/:chamado_id", authMiddleware, async (req, res) => {
  try {
    const logs = await ChamadoLog.findAll({
      where: { chamado_id: req.params.chamado_id },
      order: [["created_at", "DESC"]],
    });

    res.json(logs);
  } catch (error) {
    console.error("ERRO LOGS:", error);
    res.status(500).json({ erro: "Erro ao buscar logs" });
  }
});

export default router;