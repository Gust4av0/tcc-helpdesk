import ChamadoLog from "../models/ChamadoLog";

export const registrarLog = async ({
  chamado_id,
  status_anterior,
  status_novo,
  usuario_id,
}: any) => {
  await ChamadoLog.create({
    chamado_id,
    status_anterior,
    status_novo,
    usuario_id,
  });
};