import { Request, Response } from "express";
import Chamado from "../models/Chamado";
import Categoria from "../models/Categoria";
import { registrarLog } from "../utils/logChamado";


// CRIAR CHAMADO
export const criarChamado = async (req: any, res: Response) => {
  try {
    const { titulo, descricao, categoria_id, prioridade } = req.body;

    if (!titulo || titulo.length < 5) {
      return res.status(400).json({ erro: "Título deve ter no mínimo 5 caracteres" });
    }

    if (!descricao || descricao.length < 10) {
      return res.status(400).json({ erro: "Descrição deve ter no mínimo 10 caracteres" });
    }

    if (!categoria_id) {
      return res.status(400).json({ erro: "Categoria obrigatória" });
    }

    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    const agora = new Date();

    const prazo_atendimento = new Date(
      agora.getTime() + categoria.getDataValue("sla_atendimento") * 3600000
    );

    const prazo_resolucao = new Date(
      agora.getTime() + categoria.getDataValue("sla_resolucao") * 3600000
    );

    const chamado = await Chamado.create({
      titulo,
      descricao,
      usuario_id: req.usuario.id,
      categoria_id,
      prioridade,
      prazo_atendimento,
      prazo_resolucao,
      status: "NOVO",
    });

    // LOG CORRETO
    await registrarLog({
      chamado_id: chamado.id,
      status_anterior: null,
      status_novo: "NOVO",
      usuario_id: req.usuario.id,
      acao: "CRIOU",
      descricao: `Chamado "${titulo}" criado`,
    });

    return res.status(201).json(chamado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar chamado" });
  }
};


// LISTAR COM PAGINAÇÃO
export const listarChamados = async (req: any, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    let result;

    if (req.usuario?.tipo === "CLIENTE") {
      result = await Chamado.findAndCountAll({
        where: { usuario_id: req.usuario.id },
        include: ["usuario", "tecnico", "categoria"],
        limit,
        offset,
        order: [["id", "DESC"]],
      });
    } else {
      result = await Chamado.findAndCountAll({
        include: ["usuario", "tecnico", "categoria"],
        limit,
        offset,
        order: [["id", "DESC"]],
      });
    }

    return res.json({
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
      data: result.rows,
    });
  } catch (error) {
    console.error("ERRO LISTAR:", error);
    res.status(500).json({ erro: "Erro ao listar chamados" });
  }
};


// BUSCAR POR ID
export const buscarChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id, {
      include: ["usuario", "tecnico", "categoria"],
    });

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    if (
      req.usuario?.tipo === "CLIENTE" &&
      chamado.usuario_id !== req.usuario.id
    ) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    return res.json(chamado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar chamado" });
  }
};


// ATUALIZAR
export const atualizarChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    if (chamado.status === "FINALIZADO") {
      return res.status(400).json({ erro: "Chamado já finalizado" });
    }

    const statusAnterior = chamado.status;

    await chamado.update(req.body);

    if (req.body.status && req.body.status !== statusAnterior) {
      await registrarLog({
        chamado_id: chamado.id,
        status_anterior: statusAnterior,
        status_novo: req.body.status,
        usuario_id: req.usuario.id,
        acao: "ATUALIZOU",
        descricao: `Status alterado para ${req.body.status}`,
      });
    }

    return res.json(chamado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar chamado" });
  }
};


// DELETAR (SOFT DELETE + LOG)
export const deletarChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    const statusAnterior = chamado.status;

    await registrarLog({
      chamado_id: chamado.id,
      status_anterior: statusAnterior,
      status_novo: null,
      usuario_id: req.usuario.id,
      acao: "DELETOU",
      descricao: `Chamado "${chamado.titulo}" removido`,
    });

    await chamado.destroy();

    return res.json({ mensagem: "Chamado excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir chamado" });
  }
};


// ATRIBUIR TÉCNICO
export const atribuirChamado = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { tecnico_id } = req.body;

    const chamado = await Chamado.findByPk(id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    const statusAnterior = chamado.status;

    await chamado.update({
      tecnico_id,
      status: "ATRIBUIDO",
    });

    await registrarLog({
      chamado_id: chamado.id,
      status_anterior: statusAnterior,
      status_novo: "ATRIBUIDO",
      usuario_id: req.usuario.id,
      acao: "ATRIBUIU",
      descricao: `Chamado atribuído ao técnico ID ${tecnico_id}`,
    });

    return res.json({ mensagem: "Chamado atribuído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atribuir chamado" });
  }
};