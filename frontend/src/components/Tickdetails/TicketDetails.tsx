import {
  X,
  Calendar,
  AlertCircle,
  Clock,
  User,
  FileText,
  Activity,
} from "lucide-react";
import "./ticket-details.css";

interface TicketDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    id: number;
    tipo: string;
  } | null;
  onFinalize?: (ticketId: number) => Promise<void>;
  ticket: {
    id: string | number;
    titulo: string;
    descricao: string;
    categoria?: string | { id: number; nome: string };
    cliente?: string;
    status: string;
    prioridade: "Baixa" | "Média" | "Alta" | "Urgente" | string;
    sla?: "no-prazo" | "proximo" | "atrasado" | string;
    slaRestante?: string;
    dataAbertura?: string;
    tecnico?: string | { id: number; nome: string } | null;
    tecnico_id?: number | null;
    historico?: Array<{
      data: string;
      acao: string;
      responsavel: string;
    }>;
  } | null;
}

export function TicketDetails({ isOpen, onClose, currentUser, onFinalize, ticket }: TicketDetailsProps) {
  if (!isOpen || !ticket) return null;

  const categoriaLabel =
    typeof ticket.categoria === "string"
      ? ticket.categoria
      : (ticket.categoria?.nome ?? "Categoria");
  const tecnicoLabel =
    typeof ticket.tecnico === "string"
      ? ticket.tecnico
      : (ticket.tecnico?.nome ?? "Não atribuído");
  const slaType = ticket.sla ?? "no-prazo";
  const slaRemaining = ticket.slaRestante ?? "N/D";

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
    Novo: "novo",
    Atribuído: "atribuido",
    "Em Atendimento": "em-atendimento",
    Finalizado: "finalizado",
  };

  const statusLabelMap: Record<string, string> = {
    NOVO: "NOVO",
    ATRIBUIDO: "ATRIBUIDO",
    EM_ATENDIMENTO: "EM ATENDIMENTO",
    FINALIZADO: "FINALIZADO",
    Novo: "NOVO",
    Atribuído: "ATRIBUIDO",
    "Em Atendimento": "EM ATENDIMENTO",
    Finalizado: "FINALIZADO",
  };

  const statusLabel = statusLabelMap[ticket.status] ?? ticket.status;

  const prioridadeClassMap: Record<string, string> = {
    Baixa: "baixa",
    Média: "media",
    Alta: "alta",
    Urgente: "urgente",
  };

  const slaClassMap: Record<string, string> = {
    "no-prazo": "no-prazo",
    proximo: "proximo",
    atrasado: "atrasado",
  };

  const slaTextMap: Record<string, string> = {
    "no-prazo": "No prazo",
    proximo: "Próximo do limite",
    atrasado: "Atrasado",
  };

  const canFinalize = Boolean(
    onFinalize &&
      currentUser &&
      (currentUser.tipo === "ADMIN" || currentUser.tipo === "SUPORTE") &&
      (ticket.status === "ATRIBUIDO" || ticket.status === "EM_ATENDIMENTO") &&
      (currentUser.tipo === "ADMIN" || ticket.tecnico_id === currentUser.id),
  );

  return (
    <div className="ticket-details-overlay" onClick={handleOverlayClick}>
      <div className="ticket-details-container">
        <div className="ticket-details-header">
          <div>
            <h2>Detalhes do Chamado {ticket.id}</h2>
            <p>{ticket.titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="ticket-details-close-btn"
            aria-label="Fechar"
          >
            <X />
          </button>
        </div>

        <div className="ticket-details-body">
          {/* Informações Gerais */}
          <section className="ticket-details-section">
            <h3 className="ticket-details-section-title">
              <FileText />
              Informações Gerais
            </h3>
            <div className="ticket-details-grid">
              <div className="ticket-details-field">
                <label>Categoria</label>
                <div className="ticket-details-value">{categoriaLabel}</div>
              </div>
              <div className="ticket-details-field">
                <label>Cliente</label>
                <div className="ticket-details-value">
                  {ticket.cliente ?? "Cliente"}
                </div>
              </div>
              <div className="ticket-details-field">
                <label>Status</label>
                <span
                  className={`status-badge ${statusClassMap[ticket.status]}`}
                >
                  {statusLabel}
                </span>
              </div>
              <div className="ticket-details-field">
                <label>Prioridade</label>
                <span
                  className={`prioridade-badge ${prioridadeClassMap[ticket.prioridade]}`}
                >
                  {ticket.prioridade}
                </span>
              </div>
              <div className="ticket-details-field">
                <label>Data de Abertura</label>
                <div className="ticket-details-value">
                  <Calendar className="icon-small" />
                  {ticket.dataAbertura ?? "N/D"}
                </div>
              </div>
              <div className="ticket-details-field">
                <label>SLA</label>
                <div className={`sla-badge ${slaClassMap[slaType]}`}>
                  <Clock className="icon-small" />
                  {slaTextMap[slaType]} - {slaRemaining}
                </div>
              </div>
            </div>
          </section>

          <section className="ticket-details-section">
            <h3 className="ticket-details-section-title">
              <AlertCircle />
              Descrição do Problema
            </h3>
            <div className="ticket-details-description">{ticket.descricao}</div>
          </section>

          <section className="ticket-details-section">
            <h3 className="ticket-details-section-title">
              <User />
              Atendimento
            </h3>
            <div className="ticket-details-field">
              <label>Técnico Responsável</label>
              <div className="ticket-details-tecnico">
                <div
                  className={`tecnico-avatar ${tecnicoLabel === "Não atribuído" ? "sem-tecnico" : ""}`}
                >
                  <User />
                </div>
                <span>{tecnicoLabel}</span>
              </div>
            </div>
          </section>

          <section className="ticket-details-section">
            <h3 className="ticket-details-section-title">
              <Activity />
              Histórico de Atividades
            </h3>
            <div className="ticket-details-historico">
              {(ticket.historico ?? []).map((item, index) => (
                <div key={index} className="historico-item">
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
        </div>

        <div className="ticket-details-footer">
          <button onClick={onClose} className="btn-secondary">
            Fechar
          </button>
          {canFinalize && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onFinalize?.(Number(ticket.id))}
            >
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
