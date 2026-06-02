import { useEffect, useMemo, useState } from "react";
import {
  X,
  Calendar,
  AlertCircle,
  Clock,
  User,
  FileText,
  Activity,
  MessageSquare,
  Send,
  PlayCircle,
  RotateCcw,
  CheckCircle,
  Paperclip,
} from "lucide-react";
import {
  AttachmentPayload,
  listMessages,
  Message,
  sendMessage,
} from "../../services/message";
import { listTicketLogs, TicketLog } from "../../services/ticketLog";
import { useToast } from "../Toast/ToastContext";
import {
  isImageAttachment,
  isPdfAttachment,
  isSupportedAttachmentFile,
  MAX_ATTACHMENT_BYTES,
  openAttachment,
  parseAttachment,
} from "../../utils/attachments";
import "./ticket-details.css";

interface TicketDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    id: number;
    tipo: string;
  } | null;
  onFinalize?: (ticketId: number) => Promise<void>;
  onStatusChange?: (
    ticketId: number,
    status: string,
    observacao?: string,
  ) => Promise<void>;
  ticket: {
    id: string | number;
    titulo: string;
    descricao: string;
    categoria?:
      | string
      | { id?: number; nome: string; sla_atendimento?: number; sla_resolucao?: number };
    cliente?: string;
    usuario?: { id?: number; nome: string };
    usuario_id?: number;
    status: string;
    prioridade: "Baixa" | "Média" | "Alta" | "Urgente" | string;
    sla?: "no-prazo" | "proximo" | "atrasado" | string;
    slaRestante?: string;
    dataAbertura?: string;
    data_abertura?: string;
    created_at?: string;
    prazo_atendimento?: string;
    prazo_resolucao?: string;
    tecnico?: string | { id?: number; nome: string } | null;
    tecnico_id?: number | null;
    historico?: Array<{
      data: string;
      acao: string;
      responsavel: string;
    }>;
  } | null;
}

const quickReplies = [
  "Olá! Já estou analisando seu chamado.",
  "Pode enviar um print ou mais detalhes do erro?",
  "Realizei um ajuste. Pode testar novamente, por favor?",
  "Chamado resolvido por aqui. Vou finalizar o atendimento.",
];

function formatDate(value?: string) {
  if (!value) return "N/D";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
}

function normalizeStatus(status: string) {
  return status?.toUpperCase().replace(/\s/g, "_");
}

export function TicketDetails({
  isOpen,
  onClose,
  currentUser,
  onFinalize,
  onStatusChange,
  ticket,
}: TicketDetailsProps) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"resumo" | "chat" | "historico">(
    "resumo",
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<TicketLog[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentPayload | null>(null);
  const [imagePreview, setImagePreview] = useState<AttachmentPayload | null>(
    null,
  );
  const [isSending, setIsSending] = useState(false);
  const [validationNote, setValidationNote] = useState("");

  const ticketId = Number(ticket?.id);
  const status = normalizeStatus(ticket?.status ?? "");
  const isFinalized = status === "FINALIZADO";
  const isClosed = status === "FECHADO";
  const isEnded = isFinalized || isClosed;

  useEffect(() => {
    if (!isOpen || !ticket) return;

    setActiveTab("resumo");
    setNewMessage("");
    setValidationNote("");
    setSelectedAttachment(null);
    setImagePreview(null);

    const loadDetails = async () => {
      try {
        const [messagesResult, logsResult] = await Promise.all([
          listMessages(ticketId),
          listTicketLogs(ticketId),
        ]);
        setMessages(messagesResult);
        setLogs(logsResult);
      } catch {
        setMessages([]);
        setLogs([]);
      }
    };

    loadDetails();
  }, [isOpen, ticket, ticketId]);

  const timeline = useMemo(() => {
    if (logs.length > 0) {
      return logs.map((log) => ({
        id: log.id,
        acao: log.descricao || log.acao,
        responsavel: log.usuario?.nome ?? `Usuário #${log.usuario_id ?? "-"}`,
        data: formatDate(log.created_at),
      }));
    }

    return ticket?.historico ?? [];
  }, [logs, ticket]);

  if (!isOpen || !ticket) return null;

  const categoriaLabel =
    typeof ticket.categoria === "string"
      ? ticket.categoria
      : (ticket.categoria?.nome ?? "Categoria");
  const tecnicoLabel =
    typeof ticket.tecnico === "string"
      ? ticket.tecnico
      : (ticket.tecnico?.nome ?? "Não atribuído");
  const clienteLabel = ticket.cliente ?? ticket.usuario?.nome ?? "Cliente";
  const requesterId = ticket.usuario_id ?? ticket.usuario?.id;
  const categoriaSlaResolucao =
    typeof ticket.categoria === "string"
      ? undefined
      : ticket.categoria?.sla_resolucao;
  const fallbackDataAbertura =
    ticket.prazo_resolucao && categoriaSlaResolucao
      ? new Date(
          new Date(ticket.prazo_resolucao).getTime() -
            categoriaSlaResolucao * 3600000,
        ).toISOString()
      : undefined;
  const dataAbertura =
    ticket.dataAbertura ??
    ticket.data_abertura ??
    ticket.created_at ??
    fallbackDataAbertura;
  const prazoAtendimento = ticket.prazo_atendimento;
  const prazoResolucao = ticket.prazo_resolucao;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const statusClassMap: Record<string, string> = {
    NOVO: "novo",
    ATRIBUIDO: "atribuido",
    EM_ATENDIMENTO: "em-atendimento",
    FINALIZADO: "finalizado",
    FECHADO: "fechado",
  };

  const statusLabelMap: Record<string, string> = {
    NOVO: "NOVO",
    ATRIBUIDO: "ATRIBUÍDO",
    EM_ATENDIMENTO: "EM ATENDIMENTO",
    FINALIZADO: "FINALIZADO",
    FECHADO: "FECHADO",
  };

  const prioridadeClassMap: Record<string, string> = {
    BAIXA: "baixa",
    Baixa: "baixa",
    MEDIA: "media",
    Média: "media",
    MÉDIA: "media",
    ALTA: "alta",
    Alta: "alta",
    URGENTE: "urgente",
    Urgente: "urgente",
  };

  const canManage = Boolean(
    currentUser &&
      (currentUser.tipo === "ADMIN" ||
        (currentUser.tipo === "SUPORTE" &&
          (!ticket.tecnico_id || ticket.tecnico_id === currentUser.id))),
  );

  const canStart = Boolean(
    onStatusChange &&
      canManage &&
      (status === "NOVO" || status === "ATRIBUIDO"),
  );

  const canReopen = Boolean(
    onStatusChange && currentUser?.tipo === "ADMIN" && isEnded,
  );

  const canClientValidate = Boolean(
    onStatusChange &&
      currentUser?.tipo === "CLIENTE" &&
      currentUser.id === requesterId &&
      isFinalized,
  );

  const canFinalize = Boolean(
    onFinalize &&
      currentUser &&
      (currentUser.tipo === "ADMIN" || currentUser.tipo === "SUPORTE") &&
      (status === "ATRIBUIDO" || status === "EM_ATENDIMENTO") &&
      (currentUser.tipo === "ADMIN" || ticket.tecnico_id === currentUser.id),
  );

  const canChat = Boolean(
        currentUser &&
      !isEnded &&
      (currentUser.tipo === "ADMIN" ||
        currentUser.id === requesterId ||
        currentUser.id === ticket.tecnico_id),
  );

  const handleClientValidation = async (
    nextStatus: "EM_ATENDIMENTO" | "FECHADO",
  ) => {
    const note = validationNote.trim();

    if (note.length < 5) {
      addToast("warning", "Informe uma descrição com pelo menos 5 caracteres.");
      return;
    }

    try {
      await onStatusChange?.(ticketId, nextStatus, note);
      addToast(
        "success",
        nextStatus === "FECHADO"
          ? "Chamado aprovado e fechado."
          : "Chamado reaberto para atendimento.",
      );
      onClose();
    } catch (error) {
      addToast(
        "error",
        error instanceof Error ? error.message : "Erro ao validar chamado.",
      );
    }
  };

  const handleStatusChange = async (nextStatus: string) => {
    try {
      await onStatusChange?.(ticketId, nextStatus);
      addToast("success", "Status do chamado atualizado.");
      onClose();
    } catch (error) {
      addToast(
        "error",
        error instanceof Error ? error.message : "Erro ao atualizar status.",
      );
    }
  };

  const handleFinalize = async () => {
    try {
      await onFinalize?.(ticketId);
      addToast("success", "Chamado finalizado.");
      onClose();
    } catch (error) {
      addToast(
        "error",
        error instanceof Error ? error.message : "Erro ao finalizar chamado.",
      );
    }
  };

  const reloadMessages = async () => {
    const result = await listMessages(ticketId);
    setMessages(result);
  };

  const handleSend = async () => {
    if (!canChat || (!newMessage.trim() && !selectedAttachment)) return;

    setIsSending(true);
    try {
      await sendMessage(ticketId, newMessage.trim(), selectedAttachment);
      setNewMessage("");
      setSelectedAttachment(null);
      await reloadMessages();
    } catch (error) {
      addToast(
        "error",
        error instanceof Error ? error.message : "Erro ao enviar mensagem.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isSupportedAttachmentFile(file)) {
      addToast("error", "Tipo de arquivo não suportado. Use imagem ou PDF.");
      return;
    }

    if (file.size > MAX_ATTACHMENT_BYTES) {
      addToast("error", "Arquivo muito grande. Máximo 50MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAttachment({
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result),
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="ticket-details-overlay" onClick={handleOverlayClick}>
      <div className="ticket-details-container">
        <div className="ticket-details-header">
          <div>
            <span className="ticket-details-eyebrow">
              Chamado #{ticket.id}
            </span>
            <h2>{ticket.titulo}</h2>
            <p>
              {clienteLabel} • {categoriaLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ticket-details-close-btn"
            aria-label="Fechar"
          >
            <X />
          </button>
        </div>

        <div className="ticket-details-tabs">
          <button
            type="button"
            className={activeTab === "resumo" ? "active" : ""}
            onClick={() => setActiveTab("resumo")}
          >
            <FileText />
            Resumo
          </button>
          <button
            type="button"
            className={activeTab === "chat" ? "active" : ""}
            onClick={() => setActiveTab("chat")}
          >
            <MessageSquare />
            Conversa
            {messages.length > 0 && <strong>{messages.length}</strong>}
          </button>
          <button
            type="button"
            className={activeTab === "historico" ? "active" : ""}
            onClick={() => setActiveTab("historico")}
          >
            <Activity />
            Histórico
          </button>
        </div>

        <div className="ticket-details-body">
          {activeTab === "resumo" && (
            <>
              <section className="ticket-details-section">
                <h3 className="ticket-details-section-title">
                  <FileText />
                  Informações Gerais
                </h3>
                <div className="ticket-details-grid">
                  <div className="ticket-details-field">
                    <label>Categoria</label>
                    <div className="ticket-details-value">
                      {categoriaLabel}
                    </div>
                  </div>
                  <div className="ticket-details-field">
                    <label>Cliente</label>
                    <div className="ticket-details-value">{clienteLabel}</div>
                  </div>
                  <div className="ticket-details-field">
                    <label>Status</label>
                    <span className={`status-badge ${statusClassMap[status]}`}>
                      {statusLabelMap[status] ?? ticket.status}
                    </span>
                  </div>
                  <div className="ticket-details-field">
                    <label>Prioridade</label>
                    <span
                      className={`prioridade-badge ${
                        prioridadeClassMap[ticket.prioridade] ?? ""
                      }`}
                    >
                      {ticket.prioridade}
                    </span>
                  </div>
                  <div className="ticket-details-field">
                    <label>Data de Abertura</label>
                    <div className="ticket-details-value">
                      <Calendar className="icon-small" />
                      {formatDate(dataAbertura)}
                    </div>
                  </div>
                  <div className="ticket-details-field">
                    <label>Prazos SLA</label>
                    <div className="sla-stack">
                      <div className="sla-badge no-prazo">
                        <Clock className="icon-small" />
                        Atendimento: {formatDate(prazoAtendimento)}
                      </div>
                      <div className="sla-badge proximo">
                        <Clock className="icon-small" />
                        Resolução: {formatDate(prazoResolucao)}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="ticket-details-section">
                <h3 className="ticket-details-section-title">
                  <AlertCircle />
                  Descrição do Problema
                </h3>
                <div className="ticket-details-description">
                  {ticket.descricao}
                </div>
              </section>

              <section className="ticket-details-section">
                <h3 className="ticket-details-section-title">
                  <User />
                  Atendimento
                </h3>
                <div className="ticket-details-service-card">
                  <div
                    className={`tecnico-avatar ${
                      tecnicoLabel === "Não atribuído" ? "sem-tecnico" : ""
                    }`}
                  >
                    <User />
                  </div>
                  <div>
                    <label>Técnico Responsável</label>
                    <strong>{tecnicoLabel}</strong>
                    <span>
                      {isEnded
                        ? "Chamado encerrado"
                        : "Acompanhamento disponível na aba Conversa"}
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "chat" && (
            <section className="ticket-chat-panel">
              <div className="ticket-chat-header">
                <div>
                  <h3>Conversa do chamado</h3>
                  <p>
                    Tudo que for combinado aqui fica registrado no atendimento.
                  </p>
                </div>
                <span
                  className={`ticket-chat-status ${
                    isEnded ? "closed" : "open"
                  }`}
                >
                  {isEnded ? "Encerrado" : "Aberto"}
                </span>
              </div>

              <div className="ticket-quick-replies">
                {quickReplies.map((reply) => (
                  <button
                    type="button"
                    key={reply}
                    onClick={() => setNewMessage(reply)}
                    disabled={!canChat}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <div className="ticket-chat-messages">
                {messages.length === 0 && (
                  <div className="ticket-chat-empty">
                    Nenhuma mensagem ainda. Comece a conversa por aqui.
                  </div>
                )}

                {messages.map((message) => {
                  const isOutgoing = message.usuario_id === currentUser?.id;
                  const attachment = parseAttachment(message.anexo);
                  const isPdf = attachment ? isPdfAttachment(attachment) : false;

                  return (
                    <div
                      key={message.id}
                      className={`ticket-chat-message ${
                        isOutgoing ? "outgoing" : "incoming"
                      }`}
                    >
                      <span className="ticket-chat-sender">
                        {isOutgoing ? "Você" : `Usuário #${message.usuario_id}`}
                      </span>
                      {!!message.mensagem && (
                        <div className="ticket-chat-bubble">
                          {message.mensagem}
                        </div>
                      )}
                      {attachment && (
                        <div className="ticket-chat-attachment">
                          {isImageAttachment(attachment) ? (
                            <button
                              type="button"
                              className="ticket-chat-image-button"
                              onClick={() => setImagePreview(attachment)}
                              aria-label={`Abrir imagem ${attachment.name}`}
                              title="Abrir imagem"
                            >
                              <img
                                src={attachment.dataUrl}
                                alt={attachment.name}
                              />
                            </button>
                          ) : (
                            <a
                              href={attachment.dataUrl}
                              target="_blank"
                              rel="noreferrer"
                              download={isPdf ? undefined : attachment.name}
                              onClick={(event) => {
                                if (isPdf && attachment.dataUrl.startsWith("data:")) {
                                  event.preventDefault();
                                  openAttachment(attachment);
                                }
                              }}
                            >
                              <Paperclip />
                              {isPdf ? "Abrir PDF" : "Baixar"} {attachment.name}
                            </a>
                          )}
                        </div>
                      )}
                      <time>{formatDate(message.created_at)}</time>
                    </div>
                  );
                })}
              </div>

              {!canChat && (
                <div className="ticket-chat-locked">
                  {isFinalized
                    ? "Chamado finalizado. Valide o atendimento para fechar ou reabrir."
                    : isClosed
                      ? "Chamado fechado. Não é possível enviar mensagens."
                      : "Você não tem permissão para enviar mensagens neste chamado."}
                </div>
              )}

              <div className="ticket-chat-input-area">
                {selectedAttachment && (
                  <div className="ticket-attachment-preview">
                    <span>
                      <Paperclip />
                      {selectedAttachment.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedAttachment(null)}
                    >
                      Remover
                    </button>
                  </div>
                )}

                <div className="ticket-chat-input-row">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleSend();
                    }}
                    placeholder="Digite uma mensagem para este chamado..."
                    disabled={!canChat || isSending}
                  />
                  <label className="ticket-chat-file-btn">
                    <Paperclip />
                    Anexo
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      hidden
                      disabled={!canChat || isSending}
                      onChange={handleAttachmentChange}
                    />
                  </label>
                  <button
                    type="button"
                    className="ticket-chat-send-btn"
                    disabled={
                      !canChat ||
                      isSending ||
                      (!newMessage.trim() && !selectedAttachment)
                    }
                    onClick={handleSend}
                  >
                    <Send />
                    Enviar
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "historico" && (
            <section className="ticket-details-section">
              <h3 className="ticket-details-section-title">
                <Activity />
                Histórico de Atividades
              </h3>
              <div className="ticket-details-historico">
                {timeline.length === 0 && (
                  <div className="historico-empty">
                    Nenhuma atividade registrada ainda.
                  </div>
                )}
                {timeline.map((item, index) => (
                  <div key={`${item.acao}-${index}`} className="historico-item">
                    <div className="historico-dot"></div>
                    <div className="historico-content">
                      <div className="historico-acao">{item.acao}</div>
                      <div className="historico-meta">
                        {item.responsavel} • {item.data}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {canClientValidate && (
          <div className="ticket-client-validation">
            <label htmlFor="ticket-validation-note">
              Descrição da validação
            </label>
            <textarea
              id="ticket-validation-note"
              value={validationNote}
              onChange={(event) => setValidationNote(event.target.value)}
              placeholder="Descreva se o serviço foi aprovado ou o que ainda precisa ser ajustado."
              rows={3}
            />
          </div>
        )}

        <div className="ticket-details-footer">
          <button onClick={onClose} className="btn-secondary">
            Fechar
          </button>
          {canClientValidate && (
            <>
              <button
                type="button"
                className="btn-secondary action"
                onClick={() => handleClientValidation("EM_ATENDIMENTO")}
              >
                <RotateCcw />
                Reabrir
              </button>
              <button
                type="button"
                className="btn-primary action success"
                onClick={() => handleClientValidation("FECHADO")}
              >
                <CheckCircle />
                Aprovar
              </button>
            </>
          )}
          {canReopen && (
            <button
              type="button"
              className="btn-secondary action"
              onClick={() => handleStatusChange("EM_ATENDIMENTO")}
            >
              <RotateCcw />
              Reabrir
            </button>
          )}
          {canStart && (
            <button
              type="button"
              className="btn-primary action"
              onClick={() => handleStatusChange("EM_ATENDIMENTO")}
            >
              <PlayCircle />
              Iniciar atendimento
            </button>
          )}
          {canFinalize && (
            <button
              type="button"
              className="btn-primary action success"
              onClick={handleFinalize}
            >
              <CheckCircle />
              Finalizar
            </button>
          )}
        </div>
      </div>

      {imagePreview && (
        <div
          className="ticket-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ${imagePreview.name}`}
          onClick={(event) => {
            event.stopPropagation();
            setImagePreview(null);
          }}
        >
          <button
            type="button"
            className="ticket-image-lightbox-close"
            onClick={() => setImagePreview(null)}
            aria-label="Fechar imagem"
          >
            <X />
          </button>
          <img
            src={imagePreview.dataUrl}
            alt={imagePreview.name}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
