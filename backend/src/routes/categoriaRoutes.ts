import { Router } from "express";
import {
  criarCategoria,
  listarCategorias,
  buscarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categoriaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { verificarTipo } from "../middlewares/permissaoMiddleware";

const router = Router();

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Criar uma nova categoria (ADMIN)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: "Hardware"
 *             descricao: "Problemas físicos"
 *             sla_atendimento: 4
 *             sla_resolucao: 24
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post("/", authMiddleware, verificarTipo(["ADMIN"]), criarCategoria);

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get("/", authMiddleware, listarCategorias);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria encontrada
 */
router.get("/:id", authMiddleware, buscarCategoria);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Atualizar categoria (ADMIN)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nome: "Software"
 *             descricao: "Problemas em sistemas"
 *             sla_atendimento: 2
 *             sla_resolucao: 12
 *     responses:
 *       200:
 *         description: Categoria atualizada
 */
router.put(
  "/:id",
  authMiddleware,
  verificarTipo(["ADMIN"]),
  atualizarCategoria,
);

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Deletar categoria (ADMIN)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria deletada
 */
router.delete(
  "/:id",
  authMiddleware,
  verificarTipo(["ADMIN"]),
  deletarCategoria,
);

export default router;