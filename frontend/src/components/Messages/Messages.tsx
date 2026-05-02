import { useState } from 'react';
import { X, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import './messages.css';

interface Ticket {
  id: string;
  techName: string;
}

interface Message {
  id: string;
  sender: 'client' | 'tech';
  text: string;
  time: string;
}

interface MessagesProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockTickets: Ticket[] = [
  { id: '#2847', techName: 'Carlos Mendes' },
  { id: '#2846', techName: 'Ana Paula' },
  { id: '#2845', techName: 'Roberto Lima' },
  { id: '#2844', techName: 'Carlos Mendes' },
];

const mockMessages: Record<string, Message[]> = {
  '#2847': [
    {
      id: '1',
      sender: 'client',
      text: 'Olá, estou com problema no servidor',
      time: '10:30',
    },
    {
      id: '2',
      sender: 'tech',
      text: 'Olá! Vou verificar o problema. Pode me informar qual servidor?',
      time: '10:32',
    },
    {
      id: '3',
      sender: 'client',
      text: 'É o servidor de produção, não está respondendo',
      time: '10:35',
    },
    {
      id: '4',
      sender: 'tech',
      text: 'Entendi. Já estou verificando. Aguarde alguns minutos.',
      time: '10:36',
    },
  ],
  '#2846': [
    {
      id: '1',
      sender: 'client',
      text: 'Sistema apresentando erro ao fazer login',
      time: '09:15',
    },
    {
      id: '2',
      sender: 'tech',
      text: 'Bom dia! Qual mensagem de erro aparece?',
      time: '09:20',
    },
  ],
  '#2845': [
    {
      id: '1',
      sender: 'client',
      text: 'Internet está muito lenta',
      time: '14:00',
    },
  ],
  '#2844': [
    {
      id: '1',
      sender: 'client',
      text: 'Preciso de suporte urgente',
      time: '11:00',
    },
    {
      id: '2',
      sender: 'tech',
      text: 'Olá! Estou aqui para ajudar. Qual o problema?',
      time: '11:02',
    },
  ],
};

export function Messages({ isOpen, onClose }: MessagesProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  const handleBackClick = () => {
    setSelectedTicket(null);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'client',
      text: newMessage,
      time,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedTicket]: [...(prev[selectedTicket] || []), message],
    }));

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="messages-overlay" onClick={handleOverlayClick}>
      <div className="messages-container">
        <div className="messages-header">
          <h2>{selectedTicket ? `Chamado ${selectedTicket}` : 'Mensagens'}</h2>
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
              {mockTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="ticket-list-item"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <div className="ticket-list-item-info">
                    <span className="ticket-list-item-id">{ticket.id}</span>
                    <span className="ticket-list-item-tech">{ticket.techName}</span>
                  </div>
                  <MessageSquare className="ticket-list-item-icon" />
                </div>
              ))}
            </div>
          ) : (
            <ChatView
              ticketId={selectedTicket}
              techName={mockTickets.find((t) => t.id === selectedTicket)?.techName || ''}
              messages={messages[selectedTicket] || []}
              newMessage={newMessage}
              onBackClick={handleBackClick}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onKeyPress={handleKeyPress}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface ChatViewProps {
  ticketId: string;
  techName: string;
  messages: Message[];
  newMessage: string;
  onBackClick: () => void;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function ChatView({
  ticketId,
  techName,
  messages,
  newMessage,
  onBackClick,
  onMessageChange,
  onSendMessage,
  onKeyPress,
}: ChatViewProps) {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <button
          type="button"
          className="chat-back-btn"
          onClick={onBackClick}
          aria-label="Voltar"
        >
          <ArrowLeft />
        </button>
        <div className="chat-header-info">
          <h3>{ticketId}</h3>
          <p>{techName}</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.sender}`}>
            <div className="chat-message-sender">
              {message.sender === 'client' ? 'Você' : techName}
            </div>
            <div className="chat-message-bubble">{message.text}</div>
            <div className="chat-message-time">{message.time}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <button type="button" className="chat-send-btn" onClick={onSendMessage}>
          <Send />
          Enviar
        </button>
      </div>
    </div>
  );
}
