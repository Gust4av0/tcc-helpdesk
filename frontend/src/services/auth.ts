import { apiRequest } from "./api";

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  cpf_cnpj?: string;
  telefone?: string;
  data_nascimento?: string;
  cep?: string;
}

export interface LoginResponse {
  usuario: AuthUser;
  token: string;
}

export async function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: {
      email,
      senha: password,
    },
  });
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  cpfCnpj: string;
  telefone: string;
  dataNascimento: string;
  cep: string;
}) {
  return apiRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: {
      nome: data.name,
      email: data.email,
      senha: data.password,
      cpf_cnpj: data.cpfCnpj,
      telefone: data.telefone,
      data_nascimento: data.dataNascimento,
      cep: data.cep,
    },
  });
}
