import { useState } from 'react';
import { Calendar, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import './meus-chamados.css';

interface MeusChamado {
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
  horaAbertura: string;
  dataFinalizacao?: string;
  horaFinalizacao?: string;
  tempoAtendimento?: string;
  tecnico: string;
  historico: Array<{
    data: string;
    acao: string;
    responsavel: string;
  }>;
}

const mockMeusChamados: MeusChamado[] = [
  {
    id: '#2847',
    titulo: 'Computador não liga',
    descricao: 'O computador do setor financeiro não está ligando.',
    categoria: 'Hardware',
    cliente: 'Tech Solutions Ltda',
    status: 'Novo',
    prioridade: 'Alta',
    sla: 'no-prazo',
    slaRestante: '2h 15min restantes',
    dataAbertura: '09/03/2026',
    horaAbertura: '09:30',
    tecnico: 'Não atribuído',
    historico: [
      { data: '09/03/2026 09:30', acao: 'Chamado aberto', responsavel: 'Sistema' },
    ],
  },
  {
    id: '#2846',
    titulo: 'Sistema travando constantemente',
    descricao: 'O sistema de gestão está travando a cada 10-15 minutos.',
    categoria: 'Software',
    cliente: 'Inovação Corp',
    status: 'Em Atendimento',
    prioridade: 'Urgente',
    sla: 'proximo',
    slaRestante: '45min restantes',
    dataAbertura: '09/03/2026',
    horaAbertura: '08:00',
    tecnico: 'Carlos Mendes',
    historico: [
      { data: '09/03/2026 08:00', acao: 'Chamado aberto', responsavel: 'Sistema' },
      { data: '09/03/2026 08:15', acao: 'Atribuído ao técnico Carlos Mendes', responsavel: 'Sistema' },
      { data: '09/03/2026 08:30', acao: 'Status alterado para Em Atendimento', responsavel: 'Carlos Mendes' },
    ],
  },
  {
    id: '#2845',
    titulo: 'Lentidão na rede',
    descricao: 'A internet está muito lenta desde ontem à tarde.',
    categoria: 'Rede',
    cliente: 'Digital Commerce SA',
    status: 'Em Atendimento',
    prioridade: 'Média',
    sla: 'no-prazo',
    slaRestante: '3h 40min restantes',
    dataAbertura: '08/03/2026',
    horaAbertura: '14:20',
    tecnico: 'Ana Paula',
    historico: [
      { data: '08/03/2026 14:20', acao: 'Chamado aberto', responsavel: 'Sistema' },
      { data: '08/03/2026 14:45', acao: 'Atribuído à técnica Ana Paula', responsavel: 'Sistema' },
      { data: '09/03/2026 09:00', acao: 'Status alterado para Em Atendimento', responsavel: 'Ana Paula' },
    ],
  },
  {
    id: '#2843',
    titulo: 'Instalação de software',
    descricao: 'Solicito instalação do Adobe Creative Suite no meu computador.',
    categoria: 'Software',
    cliente: 'Start Business',
    status: 'Finalizado',
    prioridade: 'Baixa',
    sla: 'no-prazo',
    slaRestante: 'Concluído',
    dataAbertura: '07/03/2026',
    horaAbertura: '09:00',
    dataFinalizacao: '07/03/2026',
    horaFinalizacao: '11:35',
    tempoAtendimento: '2h 35min',
    tecnico: 'Carlos Mendes',
    historico: [
      { data: '07/03/2026 09:00', acao: 'Chamado aberto', responsavel: 'Sistema' },
      { data: '07/03/2026 09:20', acao: 'Atribuído ao técnico Carlos Mendes', responsavel: 'Sistema' },
      { data: '07/03/2026 10:00', acao: 'Status alterado para Em Atendimento', responsavel: 'Carlos Mendes' },
      { data: '07/03/2026 11:30', acao: 'Software instalado com sucesso', responsavel: 'Carlos Mendes' },
      { data: '07/03/2026 11:35', acao: 'Chamado finalizado', responsavel: 'Carlos Mendes' },
    ],
  },
  {
    id: '#2841',
    titulo: 'Não consigo acessar o sistema',
    descricao: 'Minha senha do sistema ERP não está funcionando.',
    categoria: 'Acesso',
    cliente: 'Prime Services',
    status: 'Novo',
    prioridade: 'Urgente',
    sla: 'proximo',
    slaRestante: '55min restantes',
    dataAbertura: '06/03/2026',
    horaAbertura: '15:00',
    tecnico: 'Não atribuído',
    historico: [
      { data: '06/03/2026 15:00', acao: 'Chamado aberto', responsavel: 'Sistema' },
    ],
  },
  {
    id: '#2838',
    titulo: 'Configuração de e-mail concluída',
    descricao: 'E-mail corporativo configurado no novo dispositivo.',
    categoria: 'E-mail',
    cliente: 'Innovation Lab',
    status: 'Finalizado',
    prioridade: 'Média',
    sla: 'no-prazo',
    slaRestante: 'Concluído',
    dataAbertura: '05/03/2026',
    horaAbertura: '10:15',
    dataFinalizacao: '05/03/2026',
    horaFinalizacao: '11:45',
    tempoAtendimento: '1h 30min',
    tecnico: 'Roberto Lima',
    historico: [
      { data: '05/03/2026 10:15', acao: 'Chamado aberto', responsavel: 'Sistema' },
      { data: '05/03/2026 10:30', acao: 'Atribuído ao técnico Roberto Lima', responsavel: 'Sistema' },
      { data: '05/03/2026 10:45', acao: 'Status alterado para Em Atendimento', responsavel: 'Roberto Lima' },
      { data: '05/03/2026 11:45', acao: 'Chamado finalizado', responsavel: 'Roberto Lima' },
    ],
  },
];

type FilterStatus = 'todos' | 'Novo' | 'Em Atendimento' | 'Finalizado';

export function MeusChamados() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');

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

  const filteredChamados = filterStatus === 'todos'
    ? mockMeusChamados
    : mockMeusChamados.filter(chamado => {
        if (filterStatus === 'Novo') {
          return chamado.status === 'Novo' || chamado.status === 'Atribuído';
        }
        return chamado.status === filterStatus;
      });

  const countAbertos = mockMeusChamados.filter(c => c.status === 'Novo' || c.status === 'Atribuído').length;
  const countEmAtendimento = mockMeusChamados.filter(c => c.status === 'Em Atendimento').length;
  const countFinalizados = mockMeusChamados.filter(c => c.status === 'Finalizado').length;

  return (
    <div className="meus-chamados-container">
      <div className="meus-chamados-header">
        <div>
          <h1>Meus Chamados</h1>
          <p>Acompanhe o status dos seus chamados</p>
        </div>
      </div>

      <div className="meus-chamados-filters">
        <button
          className={`filter-tab ${filterStatus === 'todos' ? 'active' : ''}`}
          onClick={() => setFilterStatus('todos')}
        >
          <span>Todos</span>
          <span className="filter-count">{mockMeusChamados.length}</span>
        </button>
        <button
          className={`filter-tab ${filterStatus === 'Novo' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Novo')}
        >
          <span>Abertos</span>
          <span className="filter-count">{countAbertos}</span>
        </button>
        <button
          className={`filter-tab ${filterStatus === 'Em Atendimento' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Em Atendimento')}
        >
          <span>Em Atendimento</span>
          <span className="filter-count">{countEmAtendimento}</span>
        </button>
        <button
          className={`filter-tab ${filterStatus === 'Finalizado' ? 'active' : ''}`}
          onClick={() => setFilterStatus('Finalizado')}
        >
          <span>Finalizados</span>
          <span className="filter-count">{countFinalizados}</span>
        </button>
      </div>

      <div className="meus-chamados-list">
        {filteredChamados.length === 0 ? (
          <div className="empty-state">
            <AlertCircle />
            <h3>Nenhum chamado encontrado</h3>
            <p>Não há chamados com o status selecionado</p>
          </div>
        ) : (
          filteredChamados.map((chamado) => (
            <div key={chamado.id} className="chamado-card">
              <div className="chamado-card-header">
                <div className="chamado-card-title-row">
                  <span className="chamado-id">{chamado.id}</span>
                  <div className="chamado-badges">
                    <span className={`prioridade-badge ${prioridadeClassMap[chamado.prioridade]}`}>
                      {chamado.prioridade}
                    </span>
                    <span className={`status-badge ${statusClassMap[chamado.status]}`}>
                      {chamado.status}
                    </span>
                  </div>
                </div>
                <h3 className="chamado-titulo">{chamado.titulo}</h3>
                <p className="chamado-descricao">{chamado.descricao}</p>
              </div>

              <div className="chamado-card-body">
                <div className="chamado-info-grid">
                  <div className="chamado-info-item">
                    <label>Categoria</label>
                    <span>{chamado.categoria}</span>
                  </div>
                  <div className="chamado-info-item">
                    <label>Técnico</label>
                    <div className="chamado-tecnico">
                      <User className="icon-small" />
                      <span>{chamado.tecnico}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chamado-card-footer">
                <div className="chamado-time-info">
                  <div className="time-item">
                    <Calendar className="icon-small" />
                    <span>Aberto em: {chamado.dataAbertura} às {chamado.horaAbertura}</span>
                  </div>
                  {chamado.dataFinalizacao && chamado.horaFinalizacao && (
                    <div className="time-item">
                      <CheckCircle2 className="icon-small success" />
                      <span>Finalizado em: {chamado.dataFinalizacao} às {chamado.horaFinalizacao}</span>
                    </div>
                  )}
                  {chamado.tempoAtendimento && (
                    <div className="time-item">
                      <Clock className="icon-small" />
                      <span>Tempo de atendimento: {chamado.tempoAtendimento}</span>
                    </div>
                  )}
                  {!chamado.dataFinalizacao && (
                    <div className="time-item">
                      <Clock className="icon-small" />
                      <span>SLA: {chamado.slaRestante}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
