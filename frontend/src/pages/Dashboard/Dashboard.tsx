import { useState } from 'react';
import { Sidebar } from '../../components/SidBar/Sidebar';
import { TopBar } from '../../components/TopBar/TopBar';
import { MetricCard } from '../../components/MetricCard/MetricCard';
import { Filters } from '../../components/Filters/Filters';
import { TicketTable } from '../../components/TicketTable/TicketTable';
import { OpenTicketModal } from '../../components/OpenCall/OpenTicketModal';
import { Messages } from '../../components/Messages/Messages';

import { CadastrarCategoriasModal } from '../../components/ModalCategori/CadastrarCategoriasModal';
import { TecnicosDisponiveis } from '../../components/AvailableTechnicians/TecnicosDisponiveis';
import { UsuariosCadastrados } from '../../components/RegisteredUsers/UsuariosCadastrados';

import { TicketDetails } from '../../components/Tickdetails/TicketDetails';
import { AtribuirChamado } from '../../components/AtribuirChamado';
import { MeusChamados } from '../../components/MyCallings/MeusChamados';

import { useToast } from '../../components/Toast/ToastContext';

import { Ticket, Users, Clock, CheckCircle, Plus } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { addToast } = useToast();

  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState('todas');
  const [dataFilter, setDataFilter] = useState('todas');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
  const [isTecnicosOpen, setIsTecnicosOpen] = useState(false);
  const [isUsuariosOpen, setIsUsuariosOpen] = useState(false);

  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [isAtribuirOpen, setIsAtribuirOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState<any>(null);

  const handleMenuClick = (item: string) => {
    setActiveMenuItem(item);

    if (item === 'chat') setIsMessagesOpen(true);
    if (item === 'cadastrar-categorias') setIsCategoriasModalOpen(true);
    if (item === 'tecnicos-disponiveis') setIsTecnicosOpen(true);
    if (item === 'usuarios-cadastrados') setIsUsuariosOpen(true);
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsTicketDetailsOpen(true);
  };

  const handleAtribuirClick = (tecnico: any) => {
    setSelectedTecnico(tecnico);
    setIsTecnicosOpen(false);
    setIsAtribuirOpen(true);

    addToast('success', `Técnico ${tecnico.nome} selecionado`);
  };

  return (
    <div className="app-container">
      <Sidebar
        activeItem={activeMenuItem}
        onItemClick={handleMenuClick}
      />

      <div className="app-main-wrapper">
        <TopBar /> 

        <main className="app-main-content">
          <div className="app-content-inner">

            {activeMenuItem === 'dashboard' && (
              <>
                <div className="app-header">
                  <div className="app-header-title-wrapper">
                    <h1>Dashboard</h1>
                    <p>Visão geral dos chamados técnicos</p>
                  </div>

                  <button
                    className="app-new-ticket-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus />
                    Abrir Chamado
                  </button>
                </div>

                <div className="app-metrics-grid">
                  <MetricCard title="Chamados Novos" value={12} icon={Ticket} color="blue" />
                  <MetricCard title="Chamados Atribuídos" value={28} icon={Users} color="purple" />
                  <MetricCard title="Em Atendimento" value={15} icon={Clock} color="orange" />
                  <MetricCard title="Finalizados" value={142} icon={CheckCircle} color="green" />
                </div>

                <Filters
                  statusFilter={statusFilter}
                  prioridadeFilter={prioridadeFilter}
                  dataFilter={dataFilter}
                  onStatusChange={setStatusFilter}
                  onPrioridadeChange={setPrioridadeFilter}
                  onDataChange={setDataFilter}
                />

                <TicketTable onTicketClick={handleTicketClick} />
              </>
            )}

            {activeMenuItem === 'meus-chamados' && <MeusChamados />}
          </div>
        </main>
      </div>

     

      <OpenTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log(data);
          addToast('success', 'Chamado aberto com sucesso!');
          setIsModalOpen(false);
        }}
      />

      <Messages
        isOpen={isMessagesOpen}
        onClose={() => {
          setIsMessagesOpen(false);
          setActiveMenuItem('dashboard');
        }}
      />

      <CadastrarCategoriasModal
        isOpen={isCategoriasModalOpen}
        onClose={() => setIsCategoriasModalOpen(false)}
        onSubmit={() => {
          addToast('success', 'Categoria criada com sucesso!');
          setIsCategoriasModalOpen(false);
        }}
      />

      <TecnicosDisponiveis
        isOpen={isTecnicosOpen}
        onClose={() => setIsTecnicosOpen(false)}
        onAtribuirClick={handleAtribuirClick}
      />

      <UsuariosCadastrados
        isOpen={isUsuariosOpen}
        onClose={() => setIsUsuariosOpen(false)}
      />

      <TicketDetails
        isOpen={isTicketDetailsOpen}
        onClose={() => {
          setIsTicketDetailsOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />

      <AtribuirChamado
        isOpen={isAtribuirOpen}
        onClose={() => {
          setIsAtribuirOpen(false);
          setSelectedTecnico(null);
        }}
        tecnico={selectedTecnico}
      />
    </div>
  );
}