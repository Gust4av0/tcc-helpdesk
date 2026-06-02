import { useEffect, useRef, useState } from "react";
import { X, MessageSquare, ArrowLeft, Send, Paperclip } from "lucide-react";
import { listTickets, Chamado } from "../../services/ticket";
import {
  AttachmentPayload,
  listMessages,
  sendMessage,
  Message,
} from "../../services/message";
import { useToast } from "../Toast/ToastContext";
import { AuthUser } from "../../services/auth";
import {
  isImageAttachment,
  isPdfAttachment,
  isSupportedAttachmentFile,
  MAX_ATTACHMENT_BYTES,
  openAttachment,
  parseAttachment,
} from "../../utils/attachments";
import "./messages.css";

interface MessagesProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  unreadTicketIds?: Set<number>;
  onTicketRead?: (ticketId: number, messageId?: number) => void;
  onMessagesChanged?: () => void;
}

const TICKET_REFRESH_MS = 10000;
const OPEN_CHAT_REFRESH_MS = 4000;

function formatDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) {
    return "";
  }
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Messages({
  isOpen,
  onClose,
  user,
  unreadTicketIds = new Set<number>(),
  onTicketRead,
  onMessagesChanged,
}: MessagesProps) {
  const [tickets, setTickets] = useState<Chamado[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Chamado | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentPayload | null>(null);
  const [imagePreview, setImagePreview] = useState<AttachmentPayload | null>(
    null,
  );
  const [showFinalizedTickets, setShowFinalizedTickets] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { addToast } = useToast();

  const loadTickets = async (showError = true) => {
    try {
      const result = await listTickets(1, 100);
      const allTickets = result.data;

      const accessibleTickets = allTickets.filter((ticket) => {
        if (!user) return true;
        if (user.tipo === "SUPORTE") {
          return (
            ticket.tecnico_id === user.id &&
            ["ATRIBUIDO", "EM_ATENDIMENTO", "FINALIZADO", "FECHADO"].includes(
              ticket.status,
            )
          );
        }

        if (user.tipo === "CLIENTE") {
          return ticket.usuario_id === user.id;
        }

        return true;
      });

      setTickets(accessibleTickets);
    } catch {
      if (showError) {
        addToast("error", "Erro ao carregar chamados");
      }
    }
  };

  const loadMessages = async (
    ticketId: number,
    options: { showError?: boolean; markAsRead?: boolean } = {},
  ) => {
    try {
      const result = await listMessages(ticketId);
      setMessages(result);
      const lastMessage = result[result.length - 1];

      if (options.markAsRead && lastMessage) {
        onTicketRead?.(ticketId, lastMessage.id);
      }
    } catch {
      if (options.showError !== false) {
        setMessages([]);
        addToast("error", "Erro ao carregar mensagens");
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadTickets();
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = window.setInterval(() => {
      loadTickets(false);
      onMessagesChanged?.();
    }, TICKET_REFRESH_MS);

    return () => window.clearInterval(interval);
  }, [isOpen, onMessagesChanged, user]);

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(Number(selectedTicket.id), { markAsRead: true });
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (!isOpen || !selectedTicket) return;

    const ticketId = Number(selectedTicket.id);
    const interval = window.setInterval(() => {
      loadMessages(ticketId, {
        showError: false,
        markAsRead: true,
      });
      onMessagesChanged?.();
    }, OPEN_CHAT_REFRESH_MS);

    return () => window.clearInterval(interval);
  }, [isOpen, onMessagesChanged, selectedTicket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedTicket(null);
    setMessages([]);
    setNewMessage("");
    setSelectedAttachment(null);
    setImagePreview(null);
    onClose();
  };

  const handleTicketClick = (ticket: Chamado) => {
    setSelectedTicket(ticket);
  };

  const handleBack = () => {
    setSelectedTicket(null);
    setMessages([]);
  };

  const isTicketFinalized =
    selectedTicket?.status === "FINALIZADO" ||
    selectedTicket?.status === "FECHADO";

  const handleSend = async () => {
    if (!selectedTicket || (!newMessage.trim() && !selectedAttachment) || isTicketFinalized) return;

    try {
      await sendMessage(
        Number(selectedTicket.id),
        newMessage.trim(),
        selectedAttachment,
      );
      setNewMessage("");
      setSelectedAttachment(null);
      await loadMessages(Number(selectedTicket.id), { markAsRead: true });
      onMessagesChanged?.();
    } catch {
      addToast("error", "Erro ao enviar mensagem");
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

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
      const dataUrl = reader.result as string;
      setSelectedAttachment({
        name: file.name,
        type: file.type,
        dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    setSelectedAttachment(null);
  };

  const visibleTickets = tickets.filter((ticket) =>
    showFinalizedTickets
      ? ticket.status === "FINALIZADO" || ticket.status === "FECHADO"
      : ["ATRIBUIDO", "EM_ATENDIMENTO"].includes(ticket.status),
  );

  return (
    <div className="messages-overlay" onClick={handleOverlayClick}>
      <div className="messages-container">
        <div className="messages-header">
          <h2>
            {selectedTicket ? `Chamado ${selectedTicket.id}` : "Mensagens"}
          </h2>
          <button
            type="button"
            className="messages-close-btn"
            onClick={handleClose}
            aria-label="Fechar mensagens"
          >
            <X />
          </button>
        </div>

        <div className="messages-body">
          {!selectedTicket ? (
            <>
              <div className="messages-tabs">
                <button
                  type="button"
                  className={`messages-tab ${!showFinalizedTickets ? "active" : ""}`}
                  onClick={() => setShowFinalizedTickets(false)}
                >
                  Abertos
                </button>
                <button
                  type="button"
                  className={`messages-tab ${showFinalizedTickets ? "active" : ""}`}
                  onClick={() => setShowFinalizedTickets(true)}
                >
                  Finalizados
                </button>
              </div>
              <div className="ticket-list">
                {visibleTickets.map((ticket) => {
                  const hasUnreadMessages = unreadTicketIds.has(ticket.id);

                  return (
                    <div
                      key={ticket.id}
                      className={`ticket-list-item ${hasUnreadMessages ? "unread" : ""}`}
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <div className="ticket-list-item-state">
                        <span className={`ticket-status-badge ${ticket.status.toLowerCase().replace(/_/g, "-")}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="ticket-list-item-info">
                        <span className="ticket-list-item-id">#{ticket.id}</span>
                        <span className="ticket-list-item-tech">
                          {ticket.categoria?.nome ?? "Sem categoria"}
                        </span>
                      </div>
                      <div className="ticket-list-item-message-state">
                        {hasUnreadMessages && (
                          <span className="ticket-unread-badge">Nova</span>
                        )}
                        <MessageSquare className="ticket-list-item-icon" />
                      </div>
                    </div>
                  );
                })}

                {visibleTickets.length === 0 && (
                  <div className="messages-empty-state">
                    Nenhum chamado atribuido para conversa.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="chat-container">
              <div className="chat-header">
                <button
                  type="button"
                  className="chat-back-btn"
                  onClick={handleBack}
                  aria-label="Voltar"
                >
                  <ArrowLeft />
                </button>
                <div className="chat-header-info">
                  <h3>{selectedTicket.titulo}</h3>
                  <p>{selectedTicket.categoria?.nome ?? "Chamado"}</p>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((message) => {
                  const isOutgoing = message.usuario_id === user?.id;
                  const isClient = message.usuario_id === selectedTicket.usuario_id;
                  const senderLabel = isOutgoing
                    ? "Você"
                    : isClient
                    ? "Cliente"
                    : "Suporte";

                  const attachment = parseAttachment(message.anexo);
                  const isPdf = attachment ? isPdfAttachment(attachment) : false;

                  return (
                    <div
                      key={message.id}
                      className={`chat-message ${isOutgoing ? "outgoing" : "incoming"}`}
                    >
                      <div className="chat-message-sender">
                        {senderLabel}
                      </div>
                      {!!message.mensagem && (
                        <div className="chat-message-bubble">
                          {message.mensagem}
                        </div>
                      )}
                      {attachment && (
                        <div className="chat-message-attachment">
                          {isImageAttachment(attachment) ? (
                            <button
                              type="button"
                              className="chat-attachment-image-button"
                              onClick={() => setImagePreview(attachment)}
                              aria-label={`Abrir imagem ${attachment.name}`}
                              title="Abrir imagem"
                            >
                              <img
                                src={attachment.dataUrl}
                                alt={attachment.name}
                                className="chat-attachment-image"
                              />
                            </button>
                          ) : (
                            <a
                              href={attachment.dataUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="chat-attachment-link"
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
                      {formatDateTime(message.created_at) && (
                        <div className="chat-message-time">
                          {formatDateTime(message.created_at)}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {isTicketFinalized && (
                <div className="chat-finalized-notice">
                  Chamado encerrado. Não é possível enviar novas mensagens.
                </div>
              )}

              <div className="chat-input-container">
                {selectedAttachment && (
                  <div className="attachment-preview">
                    <div className="attachment-preview-info">
                      <strong>Anexo:</strong> {selectedAttachment.name}
                    </div>
                    <button
                      type="button"
                      className="attachment-remove-btn"
                      onClick={handleRemoveAttachment}
                    >
                      Remover
                    </button>
                  </div>
                )}
                <div className="chat-input-row">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="chat-input"
                    disabled={isTicketFinalized}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                  />
                  <label className="chat-file-button">
                    Anexo
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleAttachmentChange}
                      hidden
                      disabled={isTicketFinalized}
                    />
                  </label>
                  <button
                    type="button"
                    className="chat-send-btn"
                    onClick={handleSend}
                    disabled={isTicketFinalized || (!newMessage.trim() && !selectedAttachment)}
                  >
                    <Send />
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {imagePreview && (
        <div
          className="chat-image-lightbox"
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
            className="chat-image-lightbox-close"
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
