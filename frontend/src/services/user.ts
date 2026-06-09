import { apiRequest } from "./api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  cpf_cnpj?: string;
  telefone?: string;
  data_nascimento?: string;
  cep?: string;
}

export async function listUsers() {
  return apiRequest<Usuario[]>("/usuarios");
}

export async function deleteUser(id: number) {
  return apiRequest<{ mensagem: string }>(`/usuarios/${id}`, {
    method: "DELETE",
  });
}

export async function updateUser(
  id: number,
  data: Partial<{
    nome: string;
    tipo: string;
    cpf_cnpj: string;
    telefone: string;
    data_nascimento: string;
    cep: string;
  }>,
) {
  return apiRequest<Usuario>(`/usuarios/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function getProfile() {
  return apiRequest<Usuario>("/usuarios/me");
}

export async function updateProfile(data: Partial<{ nome: string; senha: string }>) {
  return apiRequest<Usuario>("/usuarios/me", {
    method: "PUT",
    body: data,
  });
}

export async function createUser(data: {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
  cpf_cnpj?: string;
  telefone?: string;
  data_nascimento?: string;
  cep?: string;
}) {
  return apiRequest<Usuario>("/usuarios", {
    method: "POST",
    body: data,
  });
}
