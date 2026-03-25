import { Router } from "express";
import {
  criarChamado,
  listarChamados,
  buscarChamado,
  atualizarChamado,
  deletarChamado,
  atribuirChamado,
} from "../controllers/chamadoController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarTipo } from "../middlewares/permissaoMiddleware";

const router = Router();

/**
 * @swagger
 * /chamados/{id}/atribuir:
 *   put:
 *     summary: Atribuir chamado a um técnico
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do chamado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             tecnico_id: 2
 *     responses:
 *       200:
 *         description: Chamado atribuído com sucesso
 */
router.put(
  "/:id/atribuir",
  authMiddleware,
  verificarTipo(["SUPORTE", "ADMIN"]),
  atribuirChamado,
);

/**
 * @swagger
 * /chamados:
 *   get:
 *     summary: Listar chamados (com paginação)
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de chamados
 */
router.get("/", authMiddleware, listarChamados);

/**
 * @swagger
 * /chamados:
 *   post:
 *     summary: Criar um chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: "Erro no sistema"
 *             descricao: "Sistema não abre"
 *             categoria_id: 1
 *             prioridade: "ALTA"
 *     responses:
 *       201:
 *         description: Chamado criado
 */
router.post("/", authMiddleware, criarChamado);

/**
 * @swagger
 * /chamados/{id}:
 *   put:
 *     summary: Atualizar um chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             status: "EM_ATENDIMENTO"
 *     responses:
 *       200:
 *         description: Chamado atualizado
 */
router.put(
  "/:id",
  authMiddleware,
  verificarTipo(["SUPORTE", "ADMIN"]),
  atualizarChamado,
);

/**
 * @swagger
 * /chamados/{id}:
 *   delete:
 *     summary: Deletar um chamado
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chamado deletado
 */
router.delete(
  "/:id",
  authMiddleware,
  verificarTipo(["ADMIN"]),
  deletarChamado,
);

/**
 * @swagger
 * /chamados/{id}:
 *   get:
 *     summary: Buscar um chamado por ID
 *     tags: [Chamados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chamado encontrado
 */
router.get("/:id", authMiddleware, buscarChamado);

export default router;