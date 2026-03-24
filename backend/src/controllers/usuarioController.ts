import { Request, Response } from "express";
import Usuario from "../models/Usuario";

// Criar usuário
export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo,
    });

    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
};

// Listar usuários
export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
};

// Buscar por ID
export const buscarUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
};

// Atualizar
export const atualizarUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    await usuario.update(req.body);

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
};

// Deletar
export const deletarUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    await usuario.destroy();

    res.json({ mensagem: "Usuário removido" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
};
