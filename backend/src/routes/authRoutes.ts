import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realizar login e obter token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "admin@helpdesk.com"
 *             senha: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", login);

export default router;