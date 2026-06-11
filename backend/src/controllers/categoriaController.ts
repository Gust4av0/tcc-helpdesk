import { Request, Response } from "express";
import Categoria from "../models/Categoria";
import sequelize from "../config/database";

// Criar com logs e lock/transação
export const criarCategoria = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { nome, descricao, sla_atendimento, sla_resolucao } = req.body;

    console.log(`[LOG] Iniciando criação de categoria: ${nome}`);

    if (!nome || nome.length < 3) {
      await transaction.rollback();
      console.log("[LOG] Falha ao criar categoria: nome inválido");
      return res.status(400).json({ erro: "Nome inválido" });
    }

    if (!sla_atendimento || sla_atendimento <= 0) {
      await transaction.rollback();
      console.log("[LOG] Falha ao criar categoria: SLA atendimento inválido");
      return res.status(400).json({ erro: "SLA atendimento inválido" });
    }

    if (!sla_resolucao || sla_resolucao <= 0) {
      await transaction.rollback();
      console.log("[LOG] Falha ao criar categoria: SLA resolução inválido");
      return res.status(400).json({ erro: "SLA resolução inválido" });
    }

    const categoria = await Categoria.create(
      {
        nome,
        descricao,
        sla_atendimento,
        sla_resolucao,
      },
      { transaction },
    );

    await transaction.commit();

    console.log(
      `[LOG] Categoria criada com sucesso. ID: ${categoria.getDataValue("id")}`,
    );

    return res.status(201).json(categoria);
  } catch (error) {
    await transaction.rollback();

    console.log("[LOG] Erro ao criar categoria:", error);

    return res.status(500).json({ erro: "Erro ao criar categoria" });
  }
};

// Listar
export const listarCategorias = async (req: Request, res: Response) => {
  try {
    console.log("[LOG] Listando categorias");

    const categorias = await Categoria.findAll();

    return res.json(categorias);
  } catch (error) {
    console.log("[LOG] Erro ao buscar categorias:", error);

    return res.status(500).json({ erro: "Erro ao buscar categorias" });
  }
};

// Buscar por ID
export const buscarCategoria = async (req: Request, res: Response) => {
  try {
    console.log(`[LOG] Buscando categoria ID: ${req.params.id}`);

    const categoria = await Categoria.findByPk(Number(req.params.id));

    if (!categoria) {
      console.log(`[LOG] Categoria não encontrada. ID: ${req.params.id}`);
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    return res.json(categoria);
  } catch (error) {
    console.log("[LOG] Erro ao buscar categoria:", error);

    return res.status(500).json({ erro: "Erro ao buscar categoria" });
  }
};

// Atualizar
export const atualizarCategoria = async (req: Request, res: Response) => {
  try {
    console.log(`[LOG] Atualizando categoria ID: ${req.params.id}`);

    const categoria = await Categoria.findByPk(Number(req.params.id));

    if (!categoria) {
      console.log(`[LOG] Categoria não encontrada. ID: ${req.params.id}`);
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    await categoria.update(req.body);

    console.log(`[LOG] Categoria atualizada com sucesso. ID: ${req.params.id}`);

    return res.json(categoria);
  } catch (error) {
    console.log("[LOG] Erro ao atualizar categoria:", error);

    return res.status(500).json({ erro: "Erro ao atualizar categoria" });
  }
};

// Deletar
export const deletarCategoria = async (req: Request, res: Response) => {
  try {
    console.log(`[LOG] Deletando categoria ID: ${req.params.id}`);

    const categoria = await Categoria.findByPk(Number(req.params.id));

    if (!categoria) {
      console.log(`[LOG] Categoria não encontrada. ID: ${req.params.id}`);
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    await categoria.destroy();

    console.log(`[LOG] Categoria removida com sucesso. ID: ${req.params.id}`);

    return res.json({ mensagem: "Categoria removida" });
  } catch (error) {
    console.log("[LOG] Erro ao deletar categoria:", error);

    return res.status(500).json({ erro: "Erro ao deletar categoria" });
  }
};