import { Response } from "express";
import { Op, WhereOptions } from "sequelize";
import Chamado from "../models/Chamado";
import Categoria from "../models/Categoria";
import Usuario from "../models/Usuario";
import { registrarLog } from "../utils/logChamado";
import { enviarMensagemWhatsApp } from "../service/whatsappService";

// CRIAR CHAMADO
export const criarChamado = async (req: any, res: Response) => {
  try {
    const { titulo, descricao, categoria_id, prioridade } = req.body;

    if (!titulo || titulo.length < 5) {
      return res.status(400).json({ erro: "Titulo invalido" });
    }

    if (!descricao || descricao.length < 10) {
      return res.status(400).json({ erro: "Descricao invalida" });
    }

    if (!categoria_id) {
      return res.status(400).json({ erro: "Categoria obrigatoria" });
    }

    if (!prioridade) {
      return res.status(400).json({ erro: "Prioridade obrigatoria" });
    }

    const categoria = await Categoria.findByPk(categoria_id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria nao encontrada" });
    }

    const agora = new Date();

    const prazo_atendimento = new Date(
      agora.getTime() + categoria.getDataValue("sla_atendimento") * 3600000,
    );

    const prazo_resolucao = new Date(
      agora.getTime() + categoria.getDataValue("sla_resolucao") * 3600000,
    );

    const chamado = await Chamado.create({
      titulo,
      descricao,
      usuario_id: req.usuario.id,
      categoria_id,
      prioridade,
      data_abertura: agora,
      prazo_atendimento,
      prazo_resolucao,
      status: "NOVO",
    });

    await registrarLog({
      chamado_id: chamado.id,
      status_anterior: null,
      status_novo: "NOVO",
      usuario_id: req.usuario.id,
      acao: "CRIOU",
      descricao: `Chamado "${titulo}" criado`,
    });

    const cliente = await Usuario.findByPk(req.usuario.id);

    await enviarMensagemWhatsApp(
      cliente?.getDataValue("telefone"),
      `Olá, ${cliente?.getDataValue("nome")}! Recebemos seu chamado "${titulo}". Nossa equipe irá analisar e enviar atualizações em breve.`,
    );

    return res.status(201).json(chamado);
  } catch (error) {
    console.error("Erro ao criar chamado:", error);
    return res.status(500).json({ erro: "Erro ao criar chamado" });
  }
};

// LISTAR
export const listarChamados = async (req: any, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const rawLimit = Number(req.query.limit) || 10;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const offset = (page - 1) * limit;
    const status = String(req.query.status ?? "").trim().toUpperCase();
    const prioridade = String(req.query.prioridade ?? "").trim().toUpperCase();
    const busca = String(req.query.busca ?? "").trim();

    const where: WhereOptions = {};

    const statusPermitidos = [
      "NOVO",
      "ATRIBUIDO",
      "EM_ATENDIMENTO",
      "FINALIZADO",
      "FECHADO",
    ];

    const prioridadesPermitidas = ["BAIXA", "MEDIA", "ALTA", "URGENTE"];

    if (status && statusPermitidos.includes(status)) {
      where.status = status;
    }

    if (prioridade && prioridadesPermitidas.includes(prioridade)) {
      where.prioridade = prioridade;
    }

    if (busca) {
      (where as any)[Op.or] = [
        { titulo: { [Op.like]: `%${busca}%` } },
        { descricao: { [Op.like]: `%${busca}%` } },
      ];
    }

    let result;

    if (req.usuario.tipo === "CLIENTE") {
      result = await Chamado.findAndCountAll({
        where: { ...where, usuario_id: req.usuario.id },
        include: ["usuario", "tecnico", "categoria"],
        limit,
        offset,
        order: [["id", "DESC"]],
      });
    } else {
      result = await Chamado.findAndCountAll({
        where,
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
  } catch {
    return res.status(500).json({ erro: "Erro ao listar chamados" });
  }
};

// BUSCAR
export const buscarChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id, {
      include: ["usuario", "tecnico", "categoria"],
    });

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado nao encontrado" });
    }

    if (
      req.usuario.tipo === "CLIENTE" &&
      chamado.usuario_id !== req.usuario.id
    ) {
      return res.status(403).json({ erro: "Sem permissao" });
    }

    return res.json(chamado);
  } catch {
    return res.status(500).json({ erro: "Erro ao buscar chamado" });
  }
};

// ATUALIZAR
export const atualizarChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado nao encontrado" });
    }

    const statusPermitidos = [
      "NOVO",
      "ATRIBUIDO",
      "EM_ATENDIMENTO",
      "FINALIZADO",
      "FECHADO",
    ];

    const nextStatus = req.body.status;
    const observacaoValidacao = String(req.body.observacao ?? "").trim();

    if (nextStatus && !statusPermitidos.includes(nextStatus)) {
      return res.status(400).json({ erro: "Status invalido" });
    }

    const clienteValidandoChamado =
      req.usuario.tipo === "CLIENTE" &&
      chamado.usuario_id === req.usuario.id &&
      chamado.status === "FINALIZADO" &&
      (nextStatus === "EM_ATENDIMENTO" || nextStatus === "FECHADO");

    const adminReabrindoChamado =
      req.usuario.tipo === "ADMIN" &&
      (chamado.status === "FINALIZADO" || chamado.status === "FECHADO") &&
      nextStatus &&
      nextStatus !== "FINALIZADO" &&
      nextStatus !== "FECHADO";

    if (
      (chamado.status === "FINALIZADO" || chamado.status === "FECHADO") &&
      !clienteValidandoChamado &&
      !adminReabrindoChamado
    ) {
      return res.status(400).json({ erro: "Chamado encerrado" });
    }

    if (
      req.usuario.tipo === "CLIENTE" &&
      nextStatus &&
      !clienteValidandoChamado
    ) {
      return res.status(403).json({
        erro: "Cliente so pode validar chamado finalizado",
      });
    }

    if (
      nextStatus === "FINALIZADO" &&
      req.usuario.tipo === "SUPORTE" &&
      chamado.tecnico_id !== req.usuario.id
    ) {
      return res.status(403).json({ erro: "Sem permissao" });
    }

    if (req.usuario.tipo === "SUPORTE" && nextStatus) {
      const suportePodeAlterar =
        chamado.tecnico_id === req.usuario.id &&
        ["EM_ATENDIMENTO", "FINALIZADO"].includes(nextStatus);

      if (!suportePodeAlterar) {
        return res.status(403).json({
          erro: "Tecnico so pode iniciar ou finalizar chamados atribuidos a ele",
        });
      }
    }

    if (clienteValidandoChamado && observacaoValidacao.length < 5) {
      return res.status(400).json({
        erro: "Informe uma descricao com pelo menos 5 caracteres",
      });
    }

    const statusAnterior = chamado.status;

    await chamado.update(nextStatus ? { status: nextStatus } : req.body);

    if (nextStatus && nextStatus !== statusAnterior) {
      const descricaoLog =
        clienteValidandoChamado && nextStatus === "FECHADO"
          ? `Cliente aprovou e fechou o chamado: ${observacaoValidacao}`
          : clienteValidandoChamado && nextStatus === "EM_ATENDIMENTO"
            ? `Cliente reabriu o chamado: ${observacaoValidacao}`
            : `Status alterado para ${nextStatus}`;

      await registrarLog({
        chamado_id: chamado.id,
        status_anterior: statusAnterior,
        status_novo: nextStatus,
        usuario_id: req.usuario.id,
        acao: "ATUALIZOU",
        descricao: descricaoLog,
      });

      const cliente = await Usuario.findByPk(chamado.usuario_id);

      let mensagemWhatsApp = "";

      if (nextStatus === "EM_ATENDIMENTO") {
        mensagemWhatsApp = `Olá, ${cliente?.getDataValue("nome")}! O atendimento do seu chamado "${chamado.titulo}" foi iniciado. Acesse o sistema para acompanhar.`;
      }

      if (nextStatus === "FINALIZADO") {
        mensagemWhatsApp = `Olá, ${cliente?.getDataValue("nome")}! Seu chamado "${chamado.titulo}" foi finalizado. Acesse o sistema para visualizar a solução.`;
      }

      if (nextStatus === "FECHADO") {
        mensagemWhatsApp = `Olá, ${cliente?.getDataValue("nome")}! Seu chamado "${chamado.titulo}" foi fechado. Obrigado por utilizar o HelpDesk.`;
      }

      if (mensagemWhatsApp) {
        await enviarMensagemWhatsApp(
          cliente?.getDataValue("telefone"),
          mensagemWhatsApp,
        );
      }
    }

    return res.json(chamado);
  } catch {
    return res.status(500).json({ erro: "Erro ao atualizar" });
  }
};

// DELETAR
export const deletarChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado nao encontrado" });
    }

    await registrarLog({
      chamado_id: chamado.id,
      status_anterior: chamado.status,
      status_novo: null,
      usuario_id: req.usuario.id,
      acao: "DELETOU",
      descricao: `Chamado "${chamado.titulo}" removido`,
    });

    await chamado.destroy();

    return res.json({ mensagem: "Excluido com sucesso" });
  } catch {
    return res.status(500).json({ erro: "Erro ao deletar" });
  }
};

// ATRIBUIR
export const atribuirChamado = async (req: any, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id);
    const { tecnico_id } = req.body;

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado nao encontrado" });
    }

    if (!["SUPORTE", "ADMIN"].includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: "Sem permissao" });
    }

    const tecnico = await Usuario.findByPk(tecnico_id);

    if (!tecnico || tecnico.getDataValue("tipo") !== "SUPORTE") {
      return res.status(400).json({ erro: "Tecnico invalido" });
    }

    if (chamado.tecnico_id) {
      return res.status(400).json({
        erro: "Ja possui tecnico",
      });
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
      descricao: `Atribuido ao tecnico ${tecnico.getDataValue("nome")}`,
    });

    const cliente = await Usuario.findByPk(chamado.usuario_id);

    await enviarMensagemWhatsApp(
      cliente?.getDataValue("telefone"),
      `Olá, ${cliente?.getDataValue("nome")}! Seu chamado "${chamado.titulo}" foi atribuído ao técnico ${tecnico.getDataValue("nome")}. Acompanhe o atendimento pelo sistema HelpDesk.`,
    );

    return res.json({
      mensagem: "Atribuido com sucesso",
    });
  } catch {
    return res.status(500).json({ erro: "Erro ao atribuir" });
  }
};