import { apiRequest } from "./api";

export interface AttachmentPayload {
  name: string;
  type: string;
  dataUrl: string;
}

export interface Message {
  id: number;
  chamado_id: number;
  usuario_id: number;
  mensagem: string;
  anexo?: string;
  created_at: string;
}

export interface MessageSummary {
  chamado_id: number;
  last_message_id: number;
  last_usuario_id: number;
  last_mensagem: string;
  last_created_at: string;
}

export async function listMessages(chamadoId: number) {
  return apiRequest<Message[]>(`/mensagens/${chamadoId}`);
}

export async function listMessageSummaries() {
  return apiRequest<MessageSummary[]>("/mensagens/resumos");
}

export async function sendMessage(
  chamadoId: number,
  mensagem: string,
  anexo?: AttachmentPayload | null,
) {
  return apiRequest<Message>("/mensagens", {
    method: "POST",
    body: {
      chamado_id: chamadoId,
      mensagem,
      anexo,
    },
  });
}
