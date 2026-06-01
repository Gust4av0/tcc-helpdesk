import { apiRequest } from "./api";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
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
  data: Partial<{ nome: string; email: string; tipo: string }>,
) {
  return apiRequest<Usuario>(`/usuarios/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function createUser(data: {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
}) {
  return apiRequest<Usuario>("/usuarios", {
    method: "POST",
    body: data,
  });
}
