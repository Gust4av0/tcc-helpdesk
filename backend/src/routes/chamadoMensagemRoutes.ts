import { Router } from "express";
import {
  criarMensagem,
  listarMensagens,
} from "../controllers/chamadoMensagemController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarTipo } from "../middlewares/permissaoMiddleware";

const router = Router();

/**
 * @swagger
 * /chamado-mensagens:
 *   post:
 *     summary: Enviar mensagem em um chamado
 *     tags: [Chamado Mensagens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             chamado_id: 1
 *             mensagem: "Estou com problema no sistema"
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 */
router.post(
  "/",
  authMiddleware,
  verificarTipo(["CLIENTE", "SUPORTE", "ADMIN"]),
  criarMensagem,
);

/**
 * @swagger
 * /chamado-mensagens/{chamado_id}:
 *   get:
 *     summary: Listar mensagens de um chamado
 *     tags: [Chamado Mensagens]
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
 *         description: Lista de mensagens
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 chamado_id: 1
 *                 usuario_id: 2
 *                 mensagem: "Já estou verificando"
 *                 created_at: "2026-03-25T12:00:00.000Z"
 */
router.get(
  "/:chamado_id",
  authMiddleware,
  verificarTipo(["CLIENTE", "SUPORTE", "ADMIN"]),
  listarMensagens,
);

export default router;