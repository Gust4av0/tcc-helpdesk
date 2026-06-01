import { apiRequest } from "./api";

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  sla_atendimento: number;
  sla_resolucao: number;
}

export async function listCategories() {
  return apiRequest<Categoria[]>("/categorias");
}

export async function createCategory(data: {
  nome: string;
  descricao: string;
  slaAtendimento: string | number;
  slaResolucao: string | number;
}) {
  return apiRequest<Categoria>("/categorias", {
    method: "POST",
    body: {
      nome: data.nome,
      descricao: data.descricao,
      sla_atendimento: Number(data.slaAtendimento),
      sla_resolucao: Number(data.slaResolucao),
    },
  });
}

export async function updateCategory(
  id: number,
  data: {
    nome?: string;
    descricao?: string;
    slaAtendimento?: string | number;
    slaResolucao?: string | number;
  },
) {
  return apiRequest<Categoria>(`/categorias/${id}`, {
    method: "PUT",
    body: {
      nome: data.nome,
      descricao: data.descricao,
      sla_atendimento: data.slaAtendimento
        ? Number(data.slaAtendimento)
        : undefined,
      sla_resolucao: data.slaResolucao ? Number(data.slaResolucao) : undefined,
    },
  });
}

export async function deleteCategory(id: number) {
  return apiRequest<{ mensagem: string }>(`/categorias/${id}`, {
    method: "DELETE",
  });
}
