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
  const { addToast } = useToast();

  const loadTickets = async () => {
    try {
      const result = await listTickets();
      const tickets = result.data;

      if (user?.tipo === "SUPORTE") {
        setTickets(
          tickets.filter(
            (ticket) =>
              ticket.status === "NOVO" || ticket.tecnico_id === user.id,
          ),
        );
        return;
      }

      if (user?.tipo === "CLIENTE") {
        setTickets(tickets.filter((ticket) => ticket.usuario_id === user.id));
        return;
      }

      setTickets(tickets);
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

  const handleSend = async () => {
    if (!selectedTicket || !newMessage.trim()) return;
    try {
      await sendMessage(Number(selectedTicket.id), newMessage.trim());
      setNewMessage("");
      loadMessages(Number(selectedTicket.id));
    } catch {
      addToast("error", "Erro ao enviar mensagem");
    }
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
            <div className="ticket-list">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="ticket-list-item"
                  onClick={() => handleTicketClick(ticket)}
                >
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-message ${message.usuario_id === selectedTicket.usuario_id ? "client" : "tech"}`}
                  >
                    <div className="chat-message-sender">
                      {message.usuario_id === selectedTicket.usuario_id
                        ? "Você"
                        : "Suporte"}
                    </div>
                    <div className="chat-message-bubble">
                      {message.mensagem}
                    </div>
                    <div className="chat-message-time">
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="chat-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                />
                <button
                  type="button"
                  className="chat-send-btn"
                  onClick={handleSend}
                >
                  <Send />
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
