import { Request, Response, NextFunction } from "express";

export const verificarTipo = (tipos: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Não autorizado" });
    }

    if (!tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    next();
  };
};
