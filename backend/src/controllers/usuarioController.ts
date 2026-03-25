import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from "bcrypt";

export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    const tiposValidos = ["ADMIN", "SUPORTE", "CLIENTE"];

    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ erro: "Tipo inválido" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo,
    });

    res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    });
  } catch {
    res.status(500).json({ erro: "Erro ao criar" });
  }
};

export const listarUsuarios = async (req: Request, res: Response) => {
  const usuarios = await Usuario.findAll({
    attributes: { exclude: ["senha"] },
  });
  res.json(usuarios);
};

export const buscarUsuario = async (req: Request, res: Response) => {
  const usuario = await Usuario.findByPk(req.params.id, {
    attributes: { exclude: ["senha"] },
  });

  if (!usuario) {
    return res.status(404).json({ erro: "Não encontrado" });
  }

  res.json(usuario);
};

export const atualizarUsuario = async (req: any, res: Response) => {
  const usuario = await Usuario.findByPk(req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Não encontrado" });
  }

  if (req.body.tipo && req.usuario.tipo !== "ADMIN") {
    return res.status(403).json({ erro: "Sem permissão" });
  }

  await usuario.update(req.body);

  res.json(usuario);
};

export const deletarUsuario = async (req: Request, res: Response) => {
  const usuario = await Usuario.findByPk(req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Não encontrado" });
  }

  await usuario.destroy();

  res.json({ mensagem: "Removido" });
};