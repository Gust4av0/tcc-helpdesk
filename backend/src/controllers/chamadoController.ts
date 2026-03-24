import { Request, Response } from "express";
import Chamado from "../models/Chamado";
import Categoria from "../models/Categoria";
import { Request, Response } from "express";
import { registrarLog } from "../utils/logChamado";

// Criar chamado
export const criarChamado = async (req: any, res: Response) => {
  try {
    const { titulo, descricao, categoria_id, prioridade } = req.body;

    if (!titulo || !descricao || !categoria_id) {
      return res.status(400).json({ erro: "Campos obrigatórios não preenchidos" });
    }

    const categoria = await Categoria.findByPk(categoria_id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    const agora = new Date();

    const prazo_atendimento = new Date(
      agora.getTime() +
        categoria.getDataValue("sla_atendimento") * 60 * 60 * 1000
    );

    const prazo_resolucao = new Date(
      agora.getTime() +
        categoria.getDataValue("sla_resolucao") * 60 * 60 * 1000
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

    // 🔥 LOG
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

// Listar chamados
export const listarChamados = async (req: Request, res: Response) => {
  try {
    const chamados = await Chamado.findAll({
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

    res.json(chamados);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar chamados" });
  }
};

// Buscar chamado por ID
export const buscarChamado = async (req: Request, res: Response) => {
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

    res.json(chamado);
  } catch (error) {
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

    const statusAnterior = chamado.status;

    await chamado.update(req.body);

    // 🔥 LOG (só se status mudou)
    if (req.body.status && req.body.status !== statusAnterior) {
      await registrarLog({
        chamado_id: chamado.id,
        status_anterior: statusAnterior,
        status_novo: req.body.status,
        usuario_id: req.usuario.id,
      });
    }

    return res.json(chamado);
  } catch (error) {
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
    res.status(500).json({ erro: "Erro ao excluir chamado" });
  }
};

// Atribuir chamado a um técnico
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

    // 🔥 LOG
    await registrarLog({
      chamado_id: chamado.id,
      status_anterior: statusAnterior,
      status_novo: "ATRIBUIDO",
      usuario_id: req.usuario.id,
    });

    return res.json({ mensagem: "Chamado atribuído com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atribuir chamado" });
  }
};