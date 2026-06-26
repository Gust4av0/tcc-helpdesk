import { Request, Response } from "express";
import Categoria from "../models/Categoria";
import sequelize from "../config/database";
import {
  logCategoriaSucesso,
  logCategoriaErro,
} from "../utils/logCategoria";


export const criarCategoria = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { nome, descricao, sla_atendimento, sla_resolucao } = req.body;

    if (!nome || nome.length < 3) {
      await transaction.rollback();

      logCategoriaErro("Falha ao criar categoria: nome inválido", {
        Nome: nome || "Não informado",
      });

      return res.status(400).json({ erro: "Nome inválido" });
    }

    if (!sla_atendimento || sla_atendimento <= 0) {
      await transaction.rollback();

      logCategoriaErro("Falha ao criar categoria: SLA de atendimento inválido", {
        Nome: nome,
        "SLA atendimento recebido": sla_atendimento || "Não informado",
      });

      return res.status(400).json({ erro: "SLA atendimento inválido" });
    }

    if (!sla_resolucao || sla_resolucao <= 0) {
      await transaction.rollback();

      logCategoriaErro("Falha ao criar categoria: SLA de resolução inválido", {
        Nome: nome,
        "SLA resolução recebido": sla_resolucao || "Não informado",
      });

      return res.status(400).json({ erro: "SLA resolução inválido" });
    }

    const categoriaExistente = await Categoria.findOne({
      where: {
        nome,
      },
      transaction,
      lock: true,
    });

    if (categoriaExistente) {
      await transaction.rollback();

      logCategoriaErro("Falha ao criar categoria: categoria já existente", {
        Nome: nome,
      });

      return res.status(400).json({ erro: "Categoria já existente" });
    }

    const categoria = await Categoria.create(
      {
        nome,
        descricao,
        sla_atendimento,
        sla_resolucao,
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    logCategoriaSucesso("Categoria criada com sucesso", {
      ID: categoria.getDataValue("id"),
      Nome: nome,
      Descrição: descricao || "Não informada",
      "SLA atendimento": `${sla_atendimento} hora(s)`,
      "SLA resolução": `${sla_resolucao} hora(s)`,
    });

    return res.status(201).json(categoria);
  } catch (error) {
    await transaction.rollback();

    logCategoriaErro("Erro interno ao criar categoria", error);

    return res.status(500).json({ erro: "Erro ao criar categoria" });
  }
};

// Listar
export const listarCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll();

    const nomesCategorias = categorias.map((categoria: any) =>
      categoria.getDataValue("nome"),
    );

    logCategoriaSucesso("Categorias listadas com sucesso", {
      "Total de categorias": categorias.length,
      Categorias:
        nomesCategorias.length > 0
          ? nomesCategorias
          : "Nenhuma categoria cadastrada",
    });

    return res.json(categorias);
  } catch (error) {
    logCategoriaErro("Erro ao listar categorias", error);

    return res.status(500).json({ erro: "Erro ao buscar categorias" });
  }
};

// Buscar por ID
export const buscarCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await Categoria.findByPk(Number(req.params.id));

    if (!categoria) {
      logCategoriaErro("Categoria não encontrada na busca por ID", {
        ID: req.params.id,
      });

      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    logCategoriaSucesso("Categoria buscada com sucesso", {
      ID: categoria.getDataValue("id"),
      Nome: categoria.getDataValue("nome"),
      Descrição: categoria.getDataValue("descricao") || "Não informada",
      "SLA atendimento": `${categoria.getDataValue("sla_atendimento")} hora(s)`,
      "SLA resolução": `${categoria.getDataValue("sla_resolucao")} hora(s)`,
    });

    return res.json(categoria);
  } catch (error) {
    logCategoriaErro("Erro ao buscar categoria", error);

    return res.status(500).json({ erro: "Erro ao buscar categoria" });
  }
};

// Atualizar
export const atualizarCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await Categoria.findByPk(Number(req.params.id));

    if (!categoria) {
      logCategoriaErro("Falha ao atualizar categoria: categoria não encontrada", {
        ID: req.params.id,
      });

      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    const dadosAnteriores = {
      Nome: categoria.getDataValue("nome"),
      Descrição: categoria.getDataValue("descricao") || "Não informada",
      "SLA atendimento": `${categoria.getDataValue("sla_atendimento")} hora(s)`,
      "SLA resolução": `${categoria.getDataValue("sla_resolucao")} hora(s)`,
    };

    await categoria.update(req.body);

    logCategoriaSucesso("Categoria atualizada com sucesso", {
      ID: categoria.getDataValue("id"),
      "Nome anterior": dadosAnteriores.Nome,
      "Nome atualizado": categoria.getDataValue("nome"),
      "SLA atendimento atualizado": `${categoria.getDataValue(
        "sla_atendimento",
      )} hora(s)`,
      "SLA resolução atualizado": `${categoria.getDataValue(
        "sla_resolucao",
      )} hora(s)`,
      "Dados enviados na atualização": req.body,
    });

    return res.json(categoria);
  } catch (error) {
    logCategoriaErro("Erro ao atualizar categoria", error);

    return res.status(500).json({ erro: "Erro ao atualizar categoria" });
  }
};

// Deletar
export const deletarCategoria = async (req: Request, res: Response) => {
  try {
    const categoria = await Categoria.findByPk(Number(req.params.id));

    if (!categoria) {
      logCategoriaErro("Falha ao deletar categoria: categoria não encontrada", {
        ID: req.params.id,
      });

      return res.status(404).json({ erro: "Categoria não encontrada" });
    }

    const categoriaRemovida = {
      ID: categoria.getDataValue("id"),
      Nome: categoria.getDataValue("nome"),
      Descrição: categoria.getDataValue("descricao") || "Não informada",
      "SLA atendimento": `${categoria.getDataValue("sla_atendimento")} hora(s)`,
      "SLA resolução": `${categoria.getDataValue("sla_resolucao")} hora(s)`,
    };

    await categoria.destroy();

    logCategoriaSucesso("Categoria removida com sucesso", categoriaRemovida);

    return res.json({ mensagem: "Categoria removida" });
  } catch (error) {
    logCategoriaErro("Erro ao deletar categoria", error);

    return res.status(500).json({ erro: "Erro ao deletar categoria" });
  }
};