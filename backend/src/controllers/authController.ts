import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth";
import { validateUserFields } from "../utils/fieldValidation";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    const usuario: any = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha invalida" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: usuario.tipo,
      },
      authConfig.secret,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        cpf_cnpj: usuario.cpf_cnpj,
        telefone: usuario.telefone,
        data_nascimento: usuario.data_nascimento,
        cep: usuario.cep,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro no login" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, cpf_cnpj, telefone, data_nascimento, cep } =
      req.body;

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
      tipo: "CLIENTE",
      cpf_cnpj: cpf_cnpj || null,
      telefone: telefone || null,
      data_nascimento: data_nascimento || null,
      cep: cep || null,
    });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      cpf_cnpj: usuario.cpf_cnpj,
      telefone: usuario.telefone,
      data_nascimento: usuario.data_nascimento,
      cep: usuario.cep,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao registrar usuario" });
  }
};
