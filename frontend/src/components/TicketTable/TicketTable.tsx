import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import './tickettable.css';

export interface Ticket {
  id: string | number;
  titulo: string;
  descricao: string;
  categoria?: string | { id: number; nome: string };
  cliente?: string;
  status: 'Novo' | 'Atribuído' | 'Em Atendimento' | 'Finalizado' | string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente' | string;
  sla?: 'no-prazo' | 'proximo' | 'atrasado' | string;
  slaRestante?: string;
  dataAbertura?: string;
  prazo_atendimento?: string;
  tecnico?: string | { id: number; nome: string } | null;
  tecnico_id?: number | null;
  usuario?: {
    id?: number;
    nome: string;
  };
  historico?: {
    data: string;
    acao: string;
    responsavel: string;
  }[];
}

interface TicketTableProps {
  tickets?: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

export function TicketTable({ tickets, onTicketClick }: TicketTableProps) {
  const displayTickets = tickets ?? [];

  return (
    <div className="ticket-table-container">
      <div className="ticket-table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoria</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>SLA</th>
              <th>Data</th>
              <th>Técnico</th>
            </tr>
          </thead>

          <tbody>
            {displayTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-tickets-row">
                  Nenhum chamado encontrado
                </td>
              </tr>
            ) : (
              displayTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onTicketClick?.(ticket)}
                  style={{ cursor: 'pointer' }}
                >
                <td>{ticket.id}</td>
                <td>{typeof ticket.categoria === 'string' ? ticket.categoria : ticket.categoria?.nome}</td>
                <td>{(ticket as any).usuario?.nome ?? ticket.cliente ?? 'Cliente'}</td>

                <td>
                  <span className="status-badge">
                    {ticket.status}
                  </span>
                </td>

                <td>
                  <span className="prioridade-badge">
                    {ticket.prioridade}
                  </span>
                </td>

                <td>
                  <div className={`sla-indicator ${ticket.sla}`}>
                    {ticket.sla === 'no-prazo' && (
                      <>
                        <CheckCircle2 />
                        <span>No prazo</span>
                      </>
                    )}
                    {ticket.sla === 'proximo' && (
                      <>
                        <Clock />
                        <span>Próximo</span>
                      </>
                    )}
                    {ticket.sla === 'atrasado' && (
                      <>
                        <AlertCircle />
                        <span>Atrasado</span>
                      </>
                    )}
                  </div>
                </td>

                <td>{ticket.dataAbertura ?? ((ticket as any).prazo_atendimento ? new Date((ticket as any).prazo_atendimento).toLocaleDateString() : 'N/A')}</td>
                <td>{typeof ticket.tecnico === 'string' ? ticket.tecnico : ticket.tecnico?.nome ?? 'Não atribuído'}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}