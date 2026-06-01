import { apiRequest } from "./api";

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  categoria_id: number;
  categoria?: {
    id: number;
    nome: string;
  };
  prioridade: string;
  status: string;
  usuario_id: number;
  tecnico_id: number | null;
  prazo_atendimento: string;
  prazo_resolucao: string;
}

export interface Paginated<T> {
  total: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export async function listTickets(page = 1, limit = 10) {
  return apiRequest<Paginated<Chamado>>(
    `/chamados?page=${page}&limit=${limit}`,
  );
}

export async function getTicket(id: number) {
  return apiRequest<Chamado>(`/chamados/${id}`);
}

export async function createTicket(data: {
  titulo: string;
  descricao: string;
  categoria_id: number;
  prioridade: string;
}) {
  return apiRequest<Chamado>("/chamados", {
    method: "POST",
    body: data,
  });
}

export async function assignTicket(chamadoId: number, tecnico_id: number) {
  return apiRequest<{ mensagem: string }>(`/chamados/${chamadoId}/atribuir`, {
    method: "PUT",
    body: { tecnico_id },
  });
}

export async function finalizeTicket(chamadoId: number) {
  return apiRequest<{ mensagem: string }>(`/chamados/${chamadoId}`, {
    method: "PUT",
    body: { status: "FINALIZADO" },
  });
}
