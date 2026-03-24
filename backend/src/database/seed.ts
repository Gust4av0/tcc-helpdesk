import Usuario from "../models/Usuario";
import Categoria from "../models/Categoria";
import bcrypt from "bcryptjs";

export const seed = async () => {
  const senha = await bcrypt.hash("123456", 10);

  await Usuario.findOrCreate({
    where: { email: "admin@helpdesk.com" },
    defaults: {
      nome: "Admin",
      email: "admin@helpdesk.com",
      senha,
      tipo: "ADMIN",
    },
  });

  await Usuario.findOrCreate({
    where: { email: "tecnico@helpdesk.com" },
    defaults: {
      nome: "Tecnico",
      email: "tecnico@helpdesk.com",
      senha,
      tipo: "SUPORTE",
    },
  });

  await Usuario.findOrCreate({
    where: { email: "cliente@helpdesk.com" },
    defaults: {
      nome: "Cliente",
      email: "cliente@helpdesk.com",
      senha,
      tipo: "CLIENTE",
    },
  });

  await Categoria.findOrCreate({
    where: { nome: "Hardware" },
    defaults: {
      nome: "Hardware",
      descricao: "Problemas físicos",
      sla_atendimento: 4,
      sla_resolucao: 24,
    },
  });
};