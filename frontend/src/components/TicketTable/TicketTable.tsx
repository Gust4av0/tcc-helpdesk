import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import './tickettable.css';

export interface Ticket {
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
  historico: {
    data: string;
    acao: string;
    responsavel: string;
  }[];
}

interface TicketTableProps {
  onTicketClick?: (ticket: Ticket) => void;
}

const mockTickets: Ticket[] = [
  {
    id: '#2847',
    titulo: 'Erro no sistema',
    descricao: 'Sistema travando ao abrir',
    categoria: 'Hardware',
    cliente: 'Tech Solutions Ltda',
    status: 'Novo',
    prioridade: 'Alta',
    sla: 'no-prazo',
    slaRestante: '2h restantes',
    dataAbertura: '09/03/2026',
    tecnico: 'Não atribuído',
    historico: [
      { data: '09/03/2026 09:00', acao: 'Chamado criado', responsavel: 'Cliente' },
    ],
  },
  {
    id: '#2846',
    titulo: 'Servidor offline',
    descricao: 'Servidor caiu',
    categoria: 'Servidor',
    cliente: 'Inovação Corp',
    status: 'Em Atendimento',
    prioridade: 'Urgente',
    sla: 'proximo',
    slaRestante: '30min restantes',
    dataAbertura: '09/03/2026',
    tecnico: 'Carlos Mendes',
    historico: [
      { data: '09/03/2026 08:00', acao: 'Chamado criado', responsavel: 'Cliente' },
      { data: '09/03/2026 08:30', acao: 'Em atendimento', responsavel: 'Carlos Mendes' },
    ],
  },
  {
    id: '#2845',
    titulo: 'Problema de rede',
    descricao: 'Sem conexão com internet',
    categoria: 'Rede',
    cliente: 'Digital Commerce SA',
    status: 'Atribuído',
    prioridade: 'Média',
    sla: 'no-prazo',
    slaRestante: '4h restantes',
    dataAbertura: '08/03/2026',
    tecnico: 'Ana Paula',
    historico: [
      { data: '08/03/2026 10:00', acao: 'Chamado criado', responsavel: 'Cliente' },
      { data: '08/03/2026 10:20', acao: 'Atribuído', responsavel: 'Sistema' },
    ],
  },
  {
    id: '#2844',
    titulo: 'Email não envia',
    descricao: 'Erro ao enviar emails',
    categoria: 'E-mail',
    cliente: 'Consultoria Plus',
    status: 'Em Atendimento',
    prioridade: 'Alta',
    sla: 'atrasado',
    slaRestante: '1h atrasado',
    dataAbertura: '07/03/2026',
    tecnico: 'Roberto Lima',
    historico: [
      { data: '07/03/2026 09:00', acao: 'Chamado criado', responsavel: 'Cliente' },
      { data: '07/03/2026 09:40', acao: 'Em atendimento', responsavel: 'Roberto Lima' },
    ],
  },
  {
    id: '#2843',
    titulo: 'Sistema lento',
    descricao: 'Sistema com lentidão geral',
    categoria: 'Software',
    cliente: 'Start Business',
    status: 'Finalizado',
    prioridade: 'Baixa',
    sla: 'no-prazo',
    slaRestante: 'Resolvido',
    dataAbertura: '07/03/2026',
    tecnico: 'Carlos Mendes',
    historico: [
      { data: '07/03/2026 08:00', acao: 'Chamado criado', responsavel: 'Cliente' },
      { data: '07/03/2026 10:00', acao: 'Finalizado', responsavel: 'Carlos Mendes' },
    ],
  },
  {
    id: '#2842',
    titulo: 'Troca de hardware',
    descricao: 'Peça defeituosa',
    categoria: 'Hardware',
    cliente: 'Global Systems',
    status: 'Atribuído',
    prioridade: 'Média',
    sla: 'no-prazo',
    slaRestante: '6h restantes',
    dataAbertura: '06/03/2026',
    tecnico: 'Ana Paula',
    historico: [
      { data: '06/03/2026 11:00', acao: 'Chamado criado', responsavel: 'Cliente' },
    ],
  },
  {
    id: '#2841',
    titulo: 'Acesso bloqueado',
    descricao: 'Usuário não consegue logar',
    categoria: 'Acesso',
    cliente: 'Prime Services',
    status: 'Novo',
    prioridade: 'Urgente',
    sla: 'proximo',
    slaRestante: '1h restante',
    dataAbertura: '06/03/2026',
    tecnico: 'Não atribuído',
    historico: [
      { data: '06/03/2026 07:30', acao: 'Chamado criado', responsavel: 'Cliente' },
    ],
  },
];

export function TicketTable({ onTicketClick }: TicketTableProps) {
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
            {mockTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => onTicketClick?.(ticket)}
                style={{ cursor: 'pointer' }}
              >
                <td>{ticket.id}</td>
                <td>{ticket.categoria}</td>
                <td>{ticket.cliente}</td>

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

                <td>{ticket.dataAbertura}</td>
                <td>{ticket.tecnico}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}