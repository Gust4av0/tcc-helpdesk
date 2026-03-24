import { Request, Response } from "express";
import Chamado from "../models/Chamado";
import Categoria from "../models/Categoria";

// Criar chamado
export const criarChamado = async (req: Request, res: Response) => {
  try {
    const { titulo, descricao, usuario_id, categoria_id, prioridade } =
      req.body;

    if (!titulo || !descricao || !usuario_id || !categoria_id) {
      return res
        .status(400)
        .json({ erro: "Preencha todos os campos obrigatórios" });
    }

    const categoria = await Categoria.findByPk(categoria_id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    const agora = new Date();

    const prazo_atendimento = new Date(
      agora.getTime() +
        categoria.getDataValue("sla_atendimento") * 60 * 60 * 1000,
    );

    const prazo_resolucao = new Date(
      agora.getTime() +
        categoria.getDataValue("sla_resolucao") * 60 * 60 * 1000,
    );

    const chamado = await Chamado.create({
      titulo,
      descricao,
      usuario_id,
      categoria_id,
      prioridade,
      prazo_atendimento,
      prazo_resolucao,
    });

    res.status(201).json(chamado);
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
export const atualizarChamado = async (req: Request, res: Response) => {
  try {
    const chamado = await Chamado.findByPk(req.params.id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    await chamado.update(req.body);

    res.json(chamado);
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
export const atribuirChamado = async (req: Request, res: Response) => {
  try {
    const { tecnico_id } = req.body;

    if (!tecnico_id) {
      return res.status(400).json({ erro: "tecnico_id é obrigatório" });
    }

    const chamado = await Chamado.findByPk(req.params.id);

    if (!chamado) {
      return res.status(404).json({ erro: "Chamado não encontrado" });
    }

    await chamado.update({
      tecnico_id,
      status: "ATRIBUIDO",
    });

    res.json(chamado);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atribuir chamado" });
  }
};
