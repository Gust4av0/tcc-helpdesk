import { Router } from "express";
import ChamadoLog from "../models/ChamadoLog";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/:chamado_id", authMiddleware, async (req, res) => {
  const logs = await ChamadoLog.findAll({
    where: { chamado_id: req.params.chamado_id },
    order: [["created_at", "DESC"]],
  });

  res.json(logs);
});

export default router;