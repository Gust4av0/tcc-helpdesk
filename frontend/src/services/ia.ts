import { apiRequest } from "./api";

export interface IAResponse {
  resposta: string;
}

export interface IAMensagemHistorico {
  id: number;
  usuario_id: number;
  pergunta: string;
  resposta: string;
  created_at: string;
}

export async function enviarPerguntaIA(pergunta: string) {
  return apiRequest<IAResponse>("/ia/suporte", {
    method: "POST",
    body: {
      pergunta,
    },
  });
}

export async function listarHistoricoIA() {
  return apiRequest<IAMensagemHistorico[]>("/ia/historico");
}

export async function limparHistoricoIA() {
  return apiRequest<{ mensagem: string }>("/ia/historico", {
    method: "DELETE",
  });
}