import { apiRequest } from "./api";

export interface TicketLog {
  id: number;
  chamado_id: number;
  status_anterior?: string | null;
  status_novo?: string | null;
  usuario_id?: number | null;
  acao: string;
  descricao: string;
  created_at: string;
}

export async function listTicketLogs(chamadoId: number) {
  return apiRequest<TicketLog[]>(`/chamado-logs/${chamadoId}`);
}
