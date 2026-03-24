import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export const gerarToken = (usuario: any) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    },
    SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const verificarToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
};