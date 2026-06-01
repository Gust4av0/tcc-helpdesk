import { apiRequest } from "./api";

export interface Message {
  id: number;
  chamado_id: number;
  usuario_id: number;
  mensagem: string;
  created_at: string;
}

export async function listMessages(chamadoId: number) {
  return apiRequest<Message[]>(`/mensagens/${chamadoId}`);
}

export async function sendMessage(chamadoId: number, mensagem: string) {
  return apiRequest<Message>("/mensagens", {
    method: "POST",
    body: {
      chamado_id: chamadoId,
      mensagem,
    },
  });
}
