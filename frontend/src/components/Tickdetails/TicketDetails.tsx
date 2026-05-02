import { X, Calendar, AlertCircle, Clock, User, FileText, Activity } from 'lucide-react';
import './ticket-details.css';

interface TicketDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    titulo: string;
    descricao: string;
    categoria: string;
    cliente: string;
    status: 'Novo' | 'Atribuído' | 'Em Atendimento' | 'Finalizado';
    prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
    sla: 'no-prazo' | 'proximo' | 'atrasado';
    slaRestante: string;
    dataAbertura: string;
    tecnico: string;
    historico: Array<{
      data: string;
      acao: string;
      responsavel: string;
    }>;
  } | null;
}

export function TicketDetails({ isOpen, onClose, ticket }: TicketDetailsProps) {
  if (!isOpen || !ticket) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const statusClassMap = {
    'Novo': 'novo',
    'Atribuído': 'atribuido',
    'Em Atendimento': 'em-atendimento',
    'Finalizado': 'finalizado',
  };

  const prioridadeClassMap = {
    'Baixa': 'baixa',
    'Média': 'media',
    'Alta': 'alta',
    'Urgente': 'urgente',
  };

  const slaClassMap = {
    'no-prazo': 'no-prazo',
    'proximo': 'proximo',
    'atrasado': 'atrasado',
  };

  const slaTextMap = {
    'no-prazo': 'No prazo',
    'proximo': 'Próximo do limite',
    'atrasado': 'Atrasado',
  };

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
                <div className="ticket-details-value">{ticket.categoria}</div>
              </div>
              <div className="ticket-details-field">
                <label>Cliente</label>
                <div className="ticket-details-value">{ticket.cliente}</div>
              </div>
              <div className="ticket-details-field">
                <label>Status</label>
                <span className={`status-badge ${statusClassMap[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="ticket-details-field">
                <label>Prioridade</label>
                <span className={`prioridade-badge ${prioridadeClassMap[ticket.prioridade]}`}>
                  {ticket.prioridade}
                </span>
              </div>
              <div className="ticket-details-field">
                <label>Data de Abertura</label>
                <div className="ticket-details-value">
                  <Calendar className="icon-small" />
                  {ticket.dataAbertura}
                </div>
              </div>
              <div className="ticket-details-field">
                <label>SLA</label>
                <div className={`sla-badge ${slaClassMap[ticket.sla]}`}>
                  <Clock className="icon-small" />
                  {slaTextMap[ticket.sla]} - {ticket.slaRestante}
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
            <div className="ticket-details-field">
              <label>Técnico Responsável</label>
              <div className="ticket-details-tecnico">
                <div className={`tecnico-avatar ${ticket.tecnico === 'Não atribuído' ? 'sem-tecnico' : ''}`}>
                  <User />
                </div>
                <span>{ticket.tecnico}</span>
              </div>
            </div>
          </section>

         
          <section className="ticket-details-section">
            <h3 className="ticket-details-section-title">
              <Activity />
              Histórico de Atividades
            </h3>
            <div className="ticket-details-historico">
              {ticket.historico.map((item, index) => (
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
        </div>
      </div>
    </div>
  );
}
