import { Request, Response } from "express";
import Chamado from "../models/Chamado";
import Categoria from "../models/Categoria";
import { registrarLog } from "../utils/logChamado";
import { Op } from "sequelize";

// Criar chamado
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

    if (prioridade && !["BAIXA", "MEDIA", "ALTA", "URGENTE"].includes(prioridade)) {
      return res.status(400).json({ erro: "Prioridade inválida" });
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

    await registrarLog({
      chamado_id: chamado.id,
      status_anterior: null,
      status_novo: "NOVO",
      usuario_id: req.usuario.id,
    });

    return res.status(201).json(chamado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar chamado" });
  }
};

//listar chamados
export const listarChamados = async (req: any, res: Response) => {
  try {
    // PAGINAÇÃO
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // ORDENAÇÃO
    const orderField = req.query.order || "created_at";
    const direction = req.query.direction === "ASC" ? "ASC" : "DESC";

    let result;

    // CLIENTE → só os próprios chamados
    if (req.usuario?.tipo === "CLIENTE") {
      result = await Chamado.findAndCountAll({
        where: { usuario_id: req.usuario.id },
        include: [
          {
            association: "usuario",
            attributes: ["id", "nome", "email", "tipo"],
          },
          {
            association: "tecnico",
            attributes: ["id", "nome", "email", "tipo"],
          },
          {
            association: "categoria",
          },
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      });
    } else {
      // ADMIN / SUPORTE → vê tudo
      result = await Chamado.findAndCountAll({
        include: [
          {
            association: "usuario",
            attributes: ["id", "nome", "email", "tipo"],
          },
          {
            association: "tecnico",
            attributes: ["id", "nome", "email", "tipo"],
          },
          {
            association: "categoria",
          },
        ],
        limit,
        offset,
        order: [["id", "DESC"]],
      });
    }

    const total = result.count;
    const totalPages = Math.ceil(total / limit);

    return res.json({
      total,
      totalPages,
      currentPage: page,
      data: result.rows,
    });
  } catch (error) {
    console.error("ERRO PAGINAÇÃO:", error);
    return res.status(500).json({ erro: "Erro ao listar chamados" });
  }
};

// Buscar chamado 
export const buscarChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id, {
      include: [
        {
          association: "usuario",
          attributes: ["id", "nome", "email", "tipo"],
        },
        {
          association: "tecnico",
          attributes: ["id", "nome", "email", "tipo"],
        },
        {
          association: "categoria",
        },
      ],
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

// Atualizar chamado
export const atualizarChamado = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const chamado = await Chamado.findByPk(id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    if (chamado.status === "FINALIZADO") {
      return res.status(400).json({ erro: "Chamado já finalizado" });
    }

    const { titulo, descricao, status, prioridade } = req.body;

    if (titulo && titulo.length < 5) {
      return res.status(400).json({ erro: "Título inválido" });
    }

    if (descricao && descricao.length < 10) {
      return res.status(400).json({ erro: "Descrição inválida" });
    }

    if (status && !["NOVO", "ATRIBUIDO", "EM_ATENDIMENTO", "FINALIZADO"].includes(status)) {
      return res.status(400).json({ erro: "Status inválido" });
    }

    if (prioridade && !["BAIXA", "MEDIA", "ALTA", "URGENTE"].includes(prioridade)) {
      return res.status(400).json({ erro: "Prioridade inválida" });
    }

    const statusAnterior = chamado.status;

    await chamado.update(req.body);

    if (status && status !== statusAnterior) {
      await registrarLog({
        chamado_id: chamado.id,
        status_anterior: statusAnterior,
        status_novo: status,
        usuario_id: req.usuario.id,
      });
    }

    return res.json(chamado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar chamado" });
  }
};

// Deletar chamado
export const deletarChamado = async (req: Request, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    await chamado.destroy();

    res.json({ mensagem: "Chamado excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir chamado" });
  }
};

// Atribuir técnico
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
    });

    return res.json({ mensagem: "Chamado atribuído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atribuir chamado" });
  }
};