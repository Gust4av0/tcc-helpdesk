import { Request, Response } from "express";
import ChamadoMensagem from "../models/ChamadoMensagem";

// Enviar mensagem
export const criarMensagem = async (req: Request, res: Response) => {
  try {
    const { chamado_id, usuario_id, mensagem, anexo } = req.body;

    if (!chamado_id || !usuario_id || !mensagem) {
      return res
        .status(400)
        .json({ erro: "Campos obrigatórios não preenchidos" });
    }

    const novaMensagem = await ChamadoMensagem.create({
      chamado_id,
      usuario_id,
      mensagem,
      anexo,
    });

    res.status(201).json(novaMensagem);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao enviar mensagem" });
  }
};

// Listar mensagens de um chamado
export const listarMensagens = async (req: Request, res: Response) => {
  try {
    const mensagens = await ChamadoMensagem.findAll({
      where: { chamado_id: req.params.chamado_id },
      order: [["id", "ASC"]],
    });

    res.json(mensagens);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar mensagens" });
  }
};
