import ChamadoLog from "../models/ChamadoLog";

interface LogProps {
  chamado_id: number;
  status_anterior?: string | null;
  status_novo?: string | null;
  usuario_id: number;
  acao: string;
  descricao: string;
}

export const registrarLog = async ({
  chamado_id,
  status_anterior,
  status_novo,
  usuario_id,
  acao,
  descricao,
}: LogProps) => {
  await ChamadoLog.create({
    chamado_id,
    status_anterior,
    status_novo,
    usuario_id,
    acao,
    descricao,
  });
};