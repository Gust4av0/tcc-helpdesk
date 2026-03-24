import { Request, Response } from "express";
import Categoria from "../models/Categoria";

// Criar
export const criarCategoria = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, sla_atendimento, sla_resolucao } = req.body;

    if (!nome || !sla_atendimento || !sla_resolucao) {
      return res
        .status(400)
        .json({ erro: "Campos obrigatórios não preenchidos" });
    }

    const categoria = await Categoria.create({
      nome,
      descricao,
      sla_atendimento,
      sla_resolucao,
    });

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar categoria" });
  }
};

// Listar
export const listarCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar categorias" });
  }
};

// Buscar por ID
export const buscarCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar categoria" });
  }
};

// Atualizar
export const atualizarCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    await categoria.update(req.body);

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar categoria" });
  }
};

// Deletar
export const deletarCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    await categoria.destroy();

    res.json({ mensagem: "Categoria removida" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar categoria" });
  }
};
