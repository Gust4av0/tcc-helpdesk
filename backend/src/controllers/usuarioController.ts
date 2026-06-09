import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from "bcrypt";
import { validateUserFields } from "../utils/fieldValidation";

const tiposValidos = ["ADMIN", "SUPORTE", "CLIENTE"];

function removeSenha(usuario: any) {
  const usuarioJson = usuario.toJSON();
  delete usuarioJson.senha;
  return usuarioJson;
}

export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, tipo, cpf_cnpj, telefone, data_nascimento, cep } =
      req.body;

    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ erro: "Tipo invalido" });
    }

    const validationError = validateUserFields({
      nome,
      email,
      senha,
      cpf_cnpj,
      telefone,
      data_nascimento,
      cep,
      requireDetails: true,
    });

    if (validationError) {
      return res.status(400).json({ erro: validationError });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Email ja cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario: any = await Usuario.create({
      nome: nome.trim(),
      email: email.trim(),
      senha: senhaHash,
      tipo,
      cpf_cnpj: cpf_cnpj || null,
      telefone: telefone || null,
      data_nascimento: data_nascimento || null,
      cep: cep || null,
    });

    res.status(201).json(removeSenha(usuario));
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
  const usuario = await Usuario.findByPk(Number(req.params.id), {
    attributes: { exclude: ["senha"] },
  });

  if (!usuario) {
    return res.status(404).json({ erro: "Nao encontrado" });
  }

  res.json(usuario);
};

export const buscarPerfil = async (req: any, res: Response) => {
  const usuario = await Usuario.findByPk(req.usuario.id, {
    attributes: { exclude: ["senha"] },
  });

  if (!usuario) {
    return res.status(404).json({ erro: "Nao encontrado" });
  }

  res.json(usuario);
};

export const atualizarPerfil = async (req: any, res: Response) => {
  const usuario: any = await Usuario.findByPk(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Nao encontrado" });
  }

  const { nome, senha, cpf_cnpj, telefone, data_nascimento, cep } = req.body;

  if (!nome && !senha && !cpf_cnpj && !telefone && !data_nascimento && !cep) {
    return res.status(400).json({ erro: "Informe dados para atualizar" });
  }

  const validationError = validateUserFields({
    nome,
    senha,
    cpf_cnpj,
    telefone,
    data_nascimento,
    cep,
  });

  if (validationError) {
    return res.status(400).json({ erro: validationError });
  }

  const updates: any = {};

  if (nome !== undefined) updates.nome = nome.trim();
  if (cpf_cnpj !== undefined) updates.cpf_cnpj = cpf_cnpj || null;
  if (telefone !== undefined) updates.telefone = telefone || null;
  if (data_nascimento !== undefined) {
    updates.data_nascimento = data_nascimento || null;
  }
  if (cep !== undefined) updates.cep = cep || null;

  if (senha) {
    updates.senha = await bcrypt.hash(senha, 10);
  }

  await usuario.update(updates);

  res.json(removeSenha(usuario));
};

export const atualizarUsuario = async (req: any, res: Response) => {
  const usuario: any = await Usuario.findByPk(Number(req.params.id));

  if (!usuario) {
    return res.status(404).json({ erro: "Nao encontrado" });
  }

  if (req.body.tipo && req.usuario.tipo !== "ADMIN") {
    return res.status(403).json({ erro: "Sem permissao" });
  }

  if (req.body.tipo && !tiposValidos.includes(req.body.tipo)) {
    return res.status(400).json({ erro: "Tipo invalido" });
  }

  if (req.body.email && req.body.email !== usuario.email) {
    return res.status(403).json({ erro: "O email nao pode ser alterado" });
  }

  const validationError = validateUserFields({
    nome: req.body.nome,
    cpf_cnpj: req.body.cpf_cnpj,
    telefone: req.body.telefone,
    data_nascimento: req.body.data_nascimento,
    cep: req.body.cep,
  });

  if (validationError) {
    return res.status(400).json({ erro: validationError });
  }

  const updates: any = {};

  if (req.body.nome !== undefined) updates.nome = req.body.nome.trim();
  if (req.body.tipo) updates.tipo = req.body.tipo;
  if (req.body.cpf_cnpj !== undefined) {
    updates.cpf_cnpj = req.body.cpf_cnpj || null;
  }
  if (req.body.telefone !== undefined) {
    updates.telefone = req.body.telefone || null;
  }
  if (req.body.data_nascimento !== undefined) {
    updates.data_nascimento = req.body.data_nascimento || null;
  }
  if (req.body.cep !== undefined) updates.cep = req.body.cep || null;

  await usuario.update(updates);

  res.json(removeSenha(usuario));
};

export const deletarUsuario = async (req: Request, res: Response) => {
  const usuario = await Usuario.findByPk(Number(req.params.id));

  if (!usuario) {
    return res.status(404).json({ erro: "Nao encontrado" });
  }

  await usuario.destroy();

  res.json({ mensagem: "Removido" });
};
