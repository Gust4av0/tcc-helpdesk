import jwt from "jsonwebtoken";

const SECRET = "segredo_super";

export const gerarToken = (usuario: any) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    },
    SECRET,
    { expiresIn: "1d" },
  );
};

export const verificarToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
