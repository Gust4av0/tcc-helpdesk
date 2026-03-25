import { Request, Response } from "express";
import ChamadoMensagem from "../models/ChamadoMensagem";
import Chamado from "../models/Chamado";

export const criarMensagem = async (req: any, res: Response) => {
  try {
    const { chamado_id, mensagem, anexo } = req.body;

    if (!chamado_id || !mensagem) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    const chamado = await Chamado.findByPk(chamado_id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    if (chamado.status === "FINALIZADO") {
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

    const msg = await ChamadoMensagem.create({
      chamado_id,
      usuario_id: req.usuario.id,
      mensagem,
      anexo,
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

    const mensagens = await ChamadoMensagem.findAll({
      where: { chamado_id: req.params.chamado_id },
      order: [["id", "ASC"]],
    });

    res.json(mensagens);
  } catch {
    res.status(500).json({ erro: "Erro ao listar" });
  }
};