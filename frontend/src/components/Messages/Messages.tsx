import { useEffect, useState } from "react";
import { X, MessageSquare, ArrowLeft, Send } from "lucide-react";
import { listTickets, Chamado } from "../../services/ticket";
import { listMessages, sendMessage, Message } from "../../services/message";
import { useToast } from "../Toast/ToastContext";
import { AuthUser } from "../../services/auth";
import "./messages.css";

interface MessagesProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
}

export function Messages({ isOpen, onClose, user }: MessagesProps) {
  const [tickets, setTickets] = useState<Chamado[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Chamado | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState<{
    name: string;
    type: string;
    dataUrl: string;
  } | null>(null);
  const [showFinalizedTickets, setShowFinalizedTickets] = useState(false);
  const { addToast } = useToast();

  const loadTickets = async () => {
    try {
      const result = await listTickets();
      const allTickets = result.data;

      const accessibleTickets = allTickets.filter((ticket) => {
        if (!user) return true;
        if (user.tipo === "SUPORTE") {
          return (
            ticket.status === "NOVO" ||
            ticket.tecnico_id === user.id ||
            ticket.status === "FINALIZADO" && ticket.tecnico_id === user.id
          );
        }

        if (user.tipo === "CLIENTE") {
          return ticket.usuario_id === user.id;
        }

        return true;
      });

      setTickets(accessibleTickets);
    } catch {
      addToast("error", "Erro ao carregar chamados");
    }
  };

  const loadMessages = async (ticketId: number) => {
    try {
      const result = await listMessages(ticketId);
      setMessages(result);
    } catch {
      setMessages([]);
      addToast("error", "Erro ao carregar mensagens");
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadTickets();
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(Number(selectedTicket.id));
    }
  }, [selectedTicket]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTicketClick = (ticket: Chamado) => {
    setSelectedTicket(ticket);
  };

  const handleBack = () => {
    setSelectedTicket(null);
    setMessages([]);
  };

  const isTicketFinalized = selectedTicket?.status === "FINALIZADO";

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
      loadMessages(Number(selectedTicket.id));
    } catch {
      addToast("error", "Erro ao enviar mensagem");
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      addToast("error", "Tipo de arquivo não suportado. Use imagem ou PDF.");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
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
            onClick={onClose}
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
              {tickets
                .filter((ticket) =>
                  showFinalizedTickets
                    ? ticket.status === "FINALIZADO"
                    : ["NOVO", "ATRIBUIDO", "EM_ATENDIMENTO"].includes(ticket.status),
                )
                .map((ticket) => (
                <div
                  key={ticket.id}
                  className="ticket-list-item"
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
                  <MessageSquare className="ticket-list-item-icon" />
                </div>
              ))}
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

                  let attachment: { name: string; type: string; dataUrl: string } | null = null;
                  if (message.anexo) {
                    try {
                      attachment = JSON.parse(message.anexo);
                    } catch {
                      attachment = {
                        name: "anexo",
                        type: message.anexo.startsWith("data:")
                          ? message.anexo.split(";")[0].replace("data:", "")
                          : "application/octet-stream",
                        dataUrl: message.anexo,
                      };
                    }
                  }

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
                          {attachment.type.startsWith("image/") ? (
                            <img
                              src={attachment.dataUrl}
                              alt={attachment.name}
                              className="chat-attachment-image"
                            />
                          ) : (
                            <a
                              href={attachment.dataUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="chat-attachment-link"
                              download={attachment.type === "application/pdf" ? attachment.name : undefined}
                            >
                              Abrir {attachment.name}
                            </a>
                          )}
                        </div>
                      )}
                      <div className="chat-message-time">
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {isTicketFinalized && (
                <div className="chat-finalized-notice">
                  Chamado finalizado. Não é possível enviar novas mensagens.
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
    </div>
  );
}
