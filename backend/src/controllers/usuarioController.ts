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

export const buscarPerfil = async (req: any, res: Response) => {
  const usuario = await Usuario.findByPk(req.usuario.id, {
    attributes: { exclude: ["senha"] },
  });

  if (!usuario) {
    return res.status(404).json({ erro: "Não encontrado" });
  }

  res.json(usuario);
};

export const atualizarPerfil = async (req: any, res: Response) => {
  const usuario = await Usuario.findByPk(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Não encontrado" });
  }

  const { nome, senha } = req.body;

  if (!nome && !senha) {
    return res.status(400).json({ erro: "Informe nome ou senha para atualizar" });
  }

  const updates: any = {};

  if (nome) {
    updates.nome = nome;
  }

  if (senha) {
    updates.senha = await bcrypt.hash(senha, 10);
  }

  await usuario.update(updates);

  const usuarioAtualizado = usuario.toJSON();
  delete usuarioAtualizado.senha;

  res.json(usuarioAtualizado);
};

export const atualizarUsuario = async (req: any, res: Response) => {
  const usuario = await Usuario.findByPk(req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Não encontrado" });
  }

  if (req.body.tipo && req.usuario.tipo !== "ADMIN") {
    return res.status(403).json({ erro: "Sem permissão" });
  }

  if (
    req.body.tipo &&
    !["ADMIN", "SUPORTE", "CLIENTE"].includes(req.body.tipo)
  ) {
    return res.status(400).json({ erro: "Tipo inválido" });
  }

  if (req.body.email && req.body.email !== usuario.email) {
    return res.status(403).json({ erro: "O email não pode ser alterado" });
  }

  const updates: any = {};

  if (req.body.nome) {
    updates.nome = req.body.nome;
  }

  if (req.body.tipo) {
    updates.tipo = req.body.tipo;
  }

  await usuario.update(updates);

  const usuarioAtualizado = usuario.toJSON();
  delete usuarioAtualizado.senha;

  res.json(usuarioAtualizado);
};

export const deletarUsuario = async (req: Request, res: Response) => {
  const usuario = await Usuario.findByPk(req.params.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Não encontrado" });
  }

  await usuario.destroy();

  res.json({ mensagem: "Removido" });
};
