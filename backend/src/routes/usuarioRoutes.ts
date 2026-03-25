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

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Criar um novo usuário (ADMIN)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: "João Silva"
 *             email: "joao@email.com"
 *             senha: "123456"
 *             tipo: "CLIENTE"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post("/", authMiddleware, verificarTipo(["ADMIN"]), criarUsuario);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos os usuários (ADMIN)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get("/", authMiddleware, verificarTipo(["ADMIN"]), listarUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Buscar usuário por ID (ADMIN)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
router.get("/:id", authMiddleware, verificarTipo(["ADMIN"]), buscarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualizar usuário (ADMIN)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nome: "João Atualizado"
 *             tipo: "SUPORTE"
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put("/:id", authMiddleware, verificarTipo(["ADMIN"]), atualizarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deletar usuário (ADMIN)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado
 */
router.delete("/:id", authMiddleware, verificarTipo(["ADMIN"]), deletarUsuario);

export default router;