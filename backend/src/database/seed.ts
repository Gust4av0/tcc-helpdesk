import Usuario from "../models/Usuario";
import Categoria from "../models/Categoria";
import bcrypt from "bcryptjs";

export const seed = async () => {
  const senha = await bcrypt.hash("Helpdesk*", 10);

  await Usuario.findOrCreate({
    where: { email: "admin@helpdesk.com" },
    defaults: {
      nome: "Administrador",
      email: "admin@helpdesk.com",
      senha,
      tipo: "ADMIN",
    },
  });

  await Usuario.findOrCreate({
    where: { email: "tecnico@helpdesk.com" },
    defaults: {
      nome: "Tecnico Gustavo",
      email: "tecnico@helpdesk.com",
      senha,
      tipo: "SUPORTE",
    },
  });

  await Usuario.findOrCreate({
    where: { email: "cliente@helpdesk.com" },
    defaults: {
      nome: "Cliente João",
      email: "cliente@helpdesk.com",
      senha,
      tipo: "CLIENTE",
    },
  });
};
