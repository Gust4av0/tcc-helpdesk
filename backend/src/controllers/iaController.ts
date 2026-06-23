import { Response } from "express";
import Usuario from "../models/Usuario";
import IaMensagem from "../models/IaMensagem";
import { responderIAHelpDesk } from "../service/iaService";

export const responderSuporteIA = async (req: any, res: Response) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta || pergunta.trim().length < 3) {
      return res.status(400).json({
        erro: "Digite uma pergunta válida",
      });
    }

    const perguntaTratada = pergunta.trim();

    const usuario = await Usuario.findByPk(req.usuario.id);
    const nomeCompleto = usuario?.getDataValue("nome") || "Cliente";
    const primeiroNome = nomeCompleto.split(" ")[0];

    // Busca as últimas 10 conversas do usuário para dar contexto para a IA
    const historico = await IaMensagem.findAll({
      where: {
        usuario_id: req.usuario.id,
      },
      order: [["id", "DESC"]],
      limit: 10,
    });

    // Inverte para ficar do mais antigo para o mais recente
    const historicoOrdenado = historico
      .reverse()
      .map((item: any) => ({
        pergunta: item.pergunta,
        resposta: item.resposta,
      }));

    const resposta = await responderIAHelpDesk(
      perguntaTratada,
      primeiroNome,
      historicoOrdenado,
    );

    await IaMensagem.create({
      usuario_id: req.usuario.id,
      pergunta: perguntaTratada,
      resposta,
    });

    return res.json({
      resposta,
    });
  } catch (error) {
    console.log("[IA] Erro no controller:", error);

    return res.status(500).json({
      erro: "Erro ao consultar assistente de IA",
    });
  }
};

export const listarHistoricoIA = async (req: any, res: Response) => {
  try {
    const historico = await IaMensagem.findAll({
      where: {
        usuario_id: req.usuario.id,
      },
      order: [["id", "ASC"]],
    });

    return res.json(historico);
  } catch (error) {
    console.log("[IA] Erro ao buscar histórico:", error);

    return res.status(500).json({
      erro: "Erro ao buscar histórico da IA",
    });
  }
};
export const limparHistoricoIA = async (req: any, res: Response) => {
  try {
    await IaMensagem.destroy({
      where: {
        usuario_id: req.usuario.id,
      },
    });

    return res.json({
      mensagem: "Histórico da IA limpo com sucesso",
    });
  } catch (error) {
    console.log("[IA] Erro ao limpar histórico:", error);

    return res.status(500).json({
      erro: "Erro ao limpar histórico da IA",
    });
  }
};