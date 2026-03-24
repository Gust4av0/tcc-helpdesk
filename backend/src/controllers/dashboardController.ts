import { Request, Response } from "express";
import Chamado from "../models/Chamado";
import Categoria from "../models/Categoria";
import { Sequelize } from "sequelize";

export const dashboard = async (req: any, res: Response) => {
  try {
    const where: any = {};

    // CLIENTE só vê os próprios chamados
    if (req.usuario?.tipo === "CLIENTE") {
      where.usuario_id = req.usuario.id;
    }

    // TOTAL
    const total = await Chamado.count({ where });

    // POR STATUS
    const porStatusRaw = await Chamado.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("status")), "total"],
      ],
      where,
      group: ["status"],
    });

    const porStatus: any = {};
    porStatusRaw.forEach((item: any) => {
      porStatus[item.status] = Number(item.dataValues.total);
    });

    // POR PRIORIDADE
    const porPrioridadeRaw = await Chamado.findAll({
      attributes: [
        "prioridade",
        [Sequelize.fn("COUNT", Sequelize.col("prioridade")), "total"],
      ],
      where,
      group: ["prioridade"],
    });

    const porPrioridade: any = {};
    porPrioridadeRaw.forEach((item: any) => {
      porPrioridade[item.prioridade] = Number(item.dataValues.total);
    });

    // POR CATEGORIA
    const porCategoria = await Chamado.findAll({
      attributes: [
        [Sequelize.col("categoria.nome"), "nome"],
        [Sequelize.fn("COUNT", Sequelize.col("categoria_id")), "total"],
      ],
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: [],
        },
      ],
      where,
      group: ["categoria.nome"],
    });

    return res.json({
      total,
      porStatus,
      porPrioridade,
      porCategoria,
    });
  } catch (error) {
    console.error("ERRO DASHBOARD:", error);
    return res.status(500).json({ erro: "Erro no dashboard" });
  }
};
