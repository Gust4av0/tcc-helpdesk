import { Request, Response } from "express";
import ChamadoMensagem from "../models/ChamadoMensagem";
import Chamado from "../models/Chamado";
import { Op } from "sequelize";

export const criarMensagem = async (req: any, res: Response) => {
  try {
    const { chamado_id, mensagem, anexo } = req.body;

    if (!chamado_id || (!mensagem && !anexo)) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    const chamado = await Chamado.findByPk(chamado_id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    if (chamado.status === "FINALIZADO" || chamado.status === "FECHADO") {
      return res.status(400).json({ erro: "Chamado finalizado" });
    }

    if (
      req.usuario.tipo === "CLIENTE" &&
      chamado.usuario_id !== req.usuario.id
    ) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    if (
      req.usuario.tipo === "SUPORTE" &&
      chamado.tecnico_id !== req.usuario.id
    ) {
      return res.status(403).json({
        erro: "Não é o técnico",
      });
    }

    const attachmentData = anexo
      ? typeof anexo === "string"
        ? anexo
        : JSON.stringify(anexo)
      : null;

    const msg = await ChamadoMensagem.create({
      chamado_id,
      usuario_id: req.usuario.id,
      mensagem: mensagem || "",
      anexo: attachmentData,
      created_at: new Date(),
    });

    res.status(201).json(msg);
  } catch {
    res.status(500).json({ erro: "Erro ao enviar" });
  }
};

export const listarMensagens = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.chamado_id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    if (
      req.usuario.tipo === "CLIENTE" &&
      chamado.usuario_id !== req.usuario.id
    ) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    if (
      req.usuario.tipo === "SUPORTE" &&
      chamado.tecnico_id !== req.usuario.id
    ) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    const mensagens = await ChamadoMensagem.findAll({
      where: { chamado_id: req.params.chamado_id },
      order: [["id", "ASC"]],
    });

    res.json(mensagens);
  } catch {
    res.status(500).json({ erro: "Erro ao listar" });
  }
};

export const listarResumoMensagens = async (req: any, res: Response) => {
  try {
    const where: any = {};

    if (req.usuario.tipo === "CLIENTE") {
      where.usuario_id = req.usuario.id;
    }

    if (req.usuario.tipo === "SUPORTE") {
      where.tecnico_id = req.usuario.id;
    }

    const chamados = await Chamado.findAll({
      where,
      attributes: ["id"],
    });

    const chamadoIds = chamados.map((chamado: any) => chamado.id);

    if (chamadoIds.length === 0) {
      return res.json([]);
    }

    const mensagens = await ChamadoMensagem.findAll({
      where: {
        chamado_id: {
          [Op.in]: chamadoIds,
        },
      },
      order: [["id", "DESC"]],
    });

    const resumoPorChamado = new Map<number, any>();

    mensagens.forEach((mensagem: any) => {
      if (resumoPorChamado.has(mensagem.chamado_id)) {
        return;
      }

      resumoPorChamado.set(mensagem.chamado_id, {
        chamado_id: mensagem.chamado_id,
        last_message_id: mensagem.id,
        last_usuario_id: mensagem.usuario_id,
        last_mensagem: mensagem.mensagem,
        last_created_at: mensagem.created_at,
      });
    });

    res.json(Array.from(resumoPorChamado.values()));
  } catch {
    res.status(500).json({ erro: "Erro ao listar resumos" });
  }
};
