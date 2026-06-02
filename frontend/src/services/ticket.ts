import { apiRequest } from "./api";

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  categoria_id: number;
  categoria?: {
    id: number;
    nome: string;
    sla_atendimento?: number;
    sla_resolucao?: number;
  };
  prioridade: string;
  status: string;
  usuario_id: number;
  tecnico_id: number | null;
  data_abertura?: string;
  created_at?: string;
  prazo_atendimento: string;
  prazo_resolucao: string;
  usuario?: {
    id?: number;
    nome: string;
  };
  tecnico?: {
    id?: number;
    nome: string;
  } | null;
}

export interface Paginated<T> {
  total: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export interface TicketListFilters {
  status?: string;
  prioridade?: string;
  busca?: string;
}

export async function listTickets(
  page = 1,
  limit = 10,
  filters: TicketListFilters = {},
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (filters.status) params.set("status", filters.status);
  if (filters.prioridade) params.set("prioridade", filters.prioridade);
  if (filters.busca) params.set("busca", filters.busca);

  return apiRequest<Paginated<Chamado>>(`/chamados?${params.toString()}`);
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

export async function updateTicketStatus(
  chamadoId: number,
  status: string,
  observacao?: string,
) {
  return apiRequest<Chamado>(`/chamados/${chamadoId}`, {
    method: "PUT",
    body: { status, observacao },
  });
}
