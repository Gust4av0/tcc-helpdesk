import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import bcrypt from "bcrypt";

// Criar usuário
export const criarUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || nome.length < 3) {
      return res.status(400).json({ erro: "Nome inválido" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ erro: "Email inválido" });
    }

    if (!senha || senha.length < 6) {
      return res
        .status(400)
        .json({ erro: "Senha deve ter no mínimo 6 caracteres" });
    }

    //Verifica se existe o e-mail
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo,
    });

    const usuarioSemSenha = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    };

    res.status(201).json(usuarioSemSenha);
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
