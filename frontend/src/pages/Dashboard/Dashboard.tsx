import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../components/SidBar/Sidebar";
import { TopBar } from "../../components/TopBar/TopBar";
import { MetricCard } from "../../components/MetricCard/MetricCard";
import { Filters } from "../../components/Filters/Filters";
import {
  TicketTable,
  type Ticket,
} from "../../components/TicketTable/TicketTable";
import { OpenTicketModal } from "../../components/OpenCall/OpenTicketModal";
import { Messages } from "../../components/Messages/Messages";

import { CadastrarCategoriasModal } from "../../components/ModalCategori/CadastrarCategoriasModal";
import { TecnicosDisponiveis } from "../../components/AvailableTechnicians/TecnicosDisponiveis";
import { UsuariosCadastrados } from "../../components/RegisteredUsers/UsuariosCadastrados";
import { ProfileModal } from "../../components/ProfileModal/ProfileModal";

import { TicketDetails } from "../../components/Tickdetails/TicketDetails";
import { AtribuirChamado } from "../../components/AtribuirChamado";
import { MeusChamados } from "../../components/MyCallings/MeusChamados";

import { useToast } from "../../components/Toast/ToastContext";

import {
  Ticket as TicketIcon,
  Users,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import {
  listTickets,
  createTicket,
  assignTicket,
  finalizeTicket,
  updateTicketStatus,
} from "../../services/ticket";
import { getDashboard, DashboardData } from "../../services/dashboard";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Categoria,
} from "../../services/category";
import { listUsers, Usuario } from "../../services/user";
import { AuthUser } from "../../services/auth";
import "./Dashboard.css";

interface DashboardProps {
  user: AuthUser | null;
  onLogout: () => void;
  onUserUpdate: (user: AuthUser) => void;
}

export default function Dashboard({
  user,
  onLogout,
  onUserUpdate,
}: DashboardProps) {
  const { addToast } = useToast();

  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [prioridadeFilter, setPrioridadeFilter] = useState("todas");
  const [dataFilter, setDataFilter] = useState("todas");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
  const [isTecnicosOpen, setIsTecnicosOpen] = useState(false);
  const [isUsuariosOpen, setIsUsuariosOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isTicketDetailsOpen, setIsTicketDetailsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [isAtribuirOpen, setIsAtribuirOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState<Usuario | null>(null);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTickets, setNewTickets] = useState<Ticket[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [openTicketsFocusKey, setOpenTicketsFocusKey] = useState(0);
  const hasCategories = categories.length > 0;

  const handleMenuClick = (item: string) => {
    setActiveMenuItem(item);

    if (item === "chat") setIsMessagesOpen(true);
    if (item === "cadastrar-categorias") setIsCategoriasModalOpen(true);
    if (item === "tecnicos-disponiveis") setIsTecnicosOpen(true);
    if (item === "usuarios-cadastrados") setIsUsuariosOpen(true);
  };

  const loadDashboardData = async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch {
      addToast("error", "Erro ao carregar métricas do dashboard");
    }
  };

  const computedDashboardData = useMemo(() => {
    if (user?.tipo === "ADMIN") return dashboardData;

    const statusSource =
      user?.tipo === "SUPORTE" ? [...newTickets, ...tickets] : tickets;

    const statusCounts = statusSource.reduce(
      (acc, ticket) => {
        const status = ticket.status ?? "NOVO";
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      },
      {
        NOVO: 0,
        ATRIBUIDO: 0,
        EM_ATENDIMENTO: 0,
        FINALIZADO: 0,
      } as Record<string, number>,
    );

    return {
      ...dashboardData,
      porStatus: {
        NOVO: statusCounts.NOVO,
        ATRIBUIDO: statusCounts.ATRIBUIDO,
        EM_ATENDIMENTO: statusCounts.EM_ATENDIMENTO,
        FINALIZADO: statusCounts.FINALIZADO,
      },
    } as DashboardData;
  }, [dashboardData, newTickets, tickets, user]);

  const filteredTickets = useMemo(() => {
    const now = new Date();

    return tickets.filter((ticket) => {
      const status = ticket.status?.toUpperCase() ?? "NOVO";
      const prioridade = ticket.prioridade?.toLowerCase() ?? "";
      const prazoAtendimento = ticket.prazo_atendimento
        ? new Date(ticket.prazo_atendimento)
        : null;

      if (statusFilter !== "todos") {
        if (statusFilter === "em-atendimento") {
          if (status !== "ATRIBUIDO" && status !== "EM_ATENDIMENTO") {
            return false;
          }
        } else {
          const selectedStatus = {
            novo: "NOVO",
            atribuido: "ATRIBUIDO",
            finalizado: "FINALIZADO",
          }[statusFilter as string];

          if (selectedStatus && status !== selectedStatus) {
            return false;
          }
        }
      }

      if (prioridadeFilter !== "todas") {
        if (prioridade !== prioridadeFilter) {
          return false;
        }
      }

      if (dataFilter !== "todas") {
        if (!prazoAtendimento) {
          return false;
        }

        if (dataFilter === "hoje") {
          const hoje = new Date(now);
          hoje.setHours(0, 0, 0, 0);
          const fimHoje = new Date(hoje);
          fimHoje.setHours(23, 59, 59, 999);
          if (prazoAtendimento < hoje || prazoAtendimento > fimHoje) {
            return false;
          }
        }

        if (dataFilter === "semana") {
          const semanaAtras = new Date(now);
          semanaAtras.setDate(now.getDate() - 7);
          semanaAtras.setHours(0, 0, 0, 0);
          if (prazoAtendimento < semanaAtras) {
            return false;
          }
        }

        if (dataFilter === "mes") {
          const mesAtras = new Date(now);
          mesAtras.setMonth(now.getMonth() - 1);
          mesAtras.setHours(0, 0, 0, 0);
          if (prazoAtendimento < mesAtras) {
            return false;
          }
        }
      }

      return true;
    });
  }, [tickets, statusFilter, prioridadeFilter, dataFilter]);

  const urgentTicketsCount = useMemo(
    () =>
      tickets.filter(
        (ticket) => ticket.prioridade?.toUpperCase() === "URGENTE",
      ).length,
    [tickets],
  );

  const activeFiltersCount = [
    statusFilter !== "todos",
    prioridadeFilter !== "todas",
    dataFilter !== "todas",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter("todos");
    setPrioridadeFilter("todas");
    setDataFilter("todas");
  };

  const loadTickets = async () => {
    try {
      const result = await listTickets(1, 100);
      const fetchedTickets = result.data;
      const unassignedNewTickets = fetchedTickets.filter(
        (ticket) => ticket.status === "NOVO" && !ticket.tecnico_id,
      );

      if (user?.tipo === "ADMIN" || user?.tipo === "SUPORTE") {
        setNewTickets(unassignedNewTickets);
      } else {
        setNewTickets([]);
      }

      if (user?.tipo === "SUPORTE") {
        setTickets(
          fetchedTickets.filter((ticket) => ticket.tecnico_id === user.id),
        );
        return;
      }

      if (user?.tipo === "CLIENTE") {
        setTickets(
          fetchedTickets.filter((ticket) => ticket.usuario_id === user.id),
        );
        return;
      }

      setTickets(fetchedTickets);
    } catch {
      addToast("error", "Erro ao carregar chamados");
    }
  };

  const loadCategories = async () => {
    try {
      const result = await listCategories();
      setCategories(result);
    } catch {
      addToast("error", "Erro ao carregar categorias");
    }
  };

  const loadUsers = async () => {
    if (user?.tipo !== "ADMIN") {
      return;
    }

    try {
      const result = await listUsers();
      setUsers(result);
    } catch {
      addToast("error", "Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadTickets();
    loadCategories();
    loadUsers();
  }, [user]);

  useEffect(() => {
    if (user?.tipo !== "ADMIN" && user?.tipo !== "SUPORTE") {
      return;
    }

    const interval = window.setInterval(() => {
      loadDashboardData();
      loadTickets();
    }, 30000);

    return () => window.clearInterval(interval);
  }, [user]);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailsOpen(true);
  };

  const handleAtribuirClick = (tecnico: Usuario) => {
    setSelectedTecnico(tecnico);
    setIsTecnicosOpen(false);
    setIsAtribuirOpen(true);
  };

  const handleOpenNewTickets = () => {
    setActiveMenuItem("meus-chamados");
    setOpenTicketsFocusKey((current) => current + 1);
  };

  const refreshTicketsAndMetrics = () => {
    loadTickets();
    loadDashboardData();
  };

  const handleOpenTicket = async (data: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => {
    // Validar campos obrigatórios
    if (!data.title || data.title.trim().length < 5) {
      addToast("error", "Título deve ter pelo menos 5 caracteres");
      return;
    }

    if (!data.description || data.description.trim().length < 10) {
      addToast("error", "Descrição deve ter pelo menos 10 caracteres");
      return;
    }

    if (!data.category) {
      addToast("error", "Selecione uma categoria");
      return;
    }

    if (!data.priority) {
      addToast("error", "Selecione uma prioridade");
      return;
    }

    const category = categories.find((item) => item.nome === data.category);

    if (!category) {
      addToast("error", "Selecione uma categoria válida");
      return;
    }

    const prioridadeMap: Record<string, string> = {
      Baixa: "BAIXA",
      Média: "MEDIA",
      Alta: "ALTA",
      Urgente: "URGENTE",
    };

    const prioridade =
      prioridadeMap[data.priority] || data.priority.toUpperCase();

    try {
      await createTicket({
        titulo: data.title,
        descricao: data.description,
        categoria_id: category.id,
        prioridade,
      });

      addToast("success", "Chamado aberto com sucesso!");
      setIsModalOpen(false);
      loadTickets();
      loadDashboardData();
    } catch {
      addToast("error", "Erro ao abrir o chamado");
    }
  };

  const handleCreateCategory = async (data: {
    nome: string;
    descricao: string;
    slaAtendimento: string;
    slaResolucao: string;
  }) => {
    try {
      await createCategory(data);
      addToast("success", "Categoria criada com sucesso!");
      setIsCategoriasModalOpen(false);
      loadCategories();
      loadDashboardData();
    } catch {
      addToast("error", "Erro ao cadastrar categoria");
    }
  };

  const handleUpdateCategory = async (
    id: number,
    data: {
      nome: string;
      descricao: string;
      slaAtendimento: string;
      slaResolucao: string;
    },
  ) => {
    try {
      await updateCategory(id, data);
      addToast("success", "Categoria atualizada com sucesso!");
      setIsCategoriasModalOpen(false);
      loadCategories();
      loadDashboardData();
    } catch {
      addToast("error", "Erro ao atualizar categoria");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      addToast("success", "Categoria excluída com sucesso!");
      loadCategories();
      loadDashboardData();
    } catch {
      addToast("error", "Erro ao excluir categoria");
    }
  };

  const handleAssignTicket = async (ticketId: string | number) => {
    if (!selectedTecnico) {
      addToast("error", "Selecione um técnico");
      return;
    }

    try {
      const rawId =
        typeof ticketId === "string"
          ? Number(ticketId.replace("#", ""))
          : ticketId;
      await assignTicket(rawId, selectedTecnico.id);
      addToast("success", `Chamado atribuído a ${selectedTecnico.nome}`);
      setIsAtribuirOpen(false);
      setSelectedTecnico(null);
      loadTickets();
      loadDashboardData();
    } catch {
      addToast("error", "Erro ao atribuir chamado");
    }
  };

  const handleFinalizeTicket = async (ticketId: string | number) => {
    try {
      const rawId =
        typeof ticketId === "string"
          ? Number(ticketId.replace("#", ""))
          : ticketId;
      await finalizeTicket(rawId);
      addToast("success", "Chamado finalizado com sucesso");
      loadTickets();
      loadDashboardData();
    } catch {
      addToast("error", "Erro ao finalizar chamado");
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string | number,
    status: string,
  ) => {
    try {
      const rawId =
        typeof ticketId === "string"
          ? Number(ticketId.replace("#", ""))
          : ticketId;
      await updateTicketStatus(rawId, status);
      loadTickets();
      loadDashboardData();
    } catch {
      addToast("error", "Erro ao atualizar status do chamado");
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        activeItem={activeMenuItem}
        onItemClick={handleMenuClick}
        user={user}
      />

      <div className="app-main-wrapper">
        <TopBar
          user={user}
          onLogout={onLogout}
          onOpenProfile={() => setIsProfileOpen(true)}
          newTicketsCount={newTickets.length}
          onOpenNewTickets={handleOpenNewTickets}
        />

        <main className="app-main-content">
          <div className="app-content-inner">
            {activeMenuItem === "dashboard" && (
              <>
                <div className="app-header">
                  <div className="app-header-title-wrapper">
                    <h1>Dashboard</h1>
                    <p>Visão geral dos chamados técnicos</p>
                  </div>

                  {(user?.tipo === "ADMIN" || user?.tipo === "CLIENTE") && (
                    <button
                      className="app-new-ticket-btn"
                      onClick={() => setIsModalOpen(true)}
                      disabled={!hasCategories}
                    >
                      <Plus />
                      Abrir Chamado
                    </button>
                  )}
                  {!hasCategories && (
                    <p className="dashboard-warning-text">
                      Cadastre ao menos uma categoria antes de abrir um chamado.
                    </p>
                  )}
                </div>

                <div className="app-metrics-grid">
                  <MetricCard
                    title="Chamados Novos"
                    value={computedDashboardData?.porStatus?.NOVO ?? 0}
                    icon={TicketIcon}
                    color="blue"
                    trend="Entradas aguardando triagem"
                  />
                  <MetricCard
                    title="Chamados em Atendimento"
                    value={
                      (computedDashboardData?.porStatus?.ATRIBUIDO ?? 0) +
                      (computedDashboardData?.porStatus?.EM_ATENDIMENTO ?? 0)
                    }
                    icon={Users}
                    color="purple"
                    trend="Atribuídos ou em andamento"
                  />
                  <MetricCard
                    title="Urgentes"
                    value={urgentTicketsCount}
                    icon={Clock}
                    color="orange"
                    trend="Prioridade máxima na fila"
                  />
                  <MetricCard
                    title="Finalizados"
                    value={computedDashboardData?.porStatus?.FINALIZADO ?? 0}
                    icon={CheckCircle}
                    color="green"
                    trend="Chamados concluídos"
                  />
                </div>

                <Filters
                  statusFilter={statusFilter}
                  prioridadeFilter={prioridadeFilter}
                  dataFilter={dataFilter}
                  activeCount={activeFiltersCount}
                  resultCount={filteredTickets.length}
                  onStatusChange={setStatusFilter}
                  onPrioridadeChange={setPrioridadeFilter}
                  onDataChange={setDataFilter}
                  onClear={clearFilters}
                />

                <TicketTable
                  tickets={filteredTickets}
                  onTicketClick={handleTicketClick}
                />
              </>
            )}

            {activeMenuItem === "meus-chamados" && (
              <MeusChamados
                user={user}
                tecnicos={users.filter((usuario) => usuario.tipo === "SUPORTE")}
                openTicketsFocusKey={openTicketsFocusKey}
                onTicketChanged={refreshTicketsAndMetrics}
              />
            )}
          </div>
        </main>
      </div>

      <OpenTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleOpenTicket}
        categories={categories}
      />

      <Messages
        isOpen={isMessagesOpen}
        onClose={() => {
          setIsMessagesOpen(false);
          setActiveMenuItem("dashboard");
        }}
        user={user}
      />

      <CadastrarCategoriasModal
        isOpen={isCategoriasModalOpen}
        onClose={() => setIsCategoriasModalOpen(false)}
        onSubmit={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        categories={categories}
        onDeleteCategory={handleDeleteCategory}
      />

      <TecnicosDisponiveis
        isOpen={isTecnicosOpen}
        onClose={() => setIsTecnicosOpen(false)}
        tecnicos={users.filter((usuario) => usuario.tipo === "SUPORTE")}
        onAtribuirClick={handleAtribuirClick}
      />

      <UsuariosCadastrados
        isOpen={isUsuariosOpen}
        onClose={() => setIsUsuariosOpen(false)}
        usuarios={users}
        onRefresh={loadUsers}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        user={user}
        onClose={() => setIsProfileOpen(false)}
        onProfileUpdated={onUserUpdate}
      />

      <TicketDetails
        isOpen={isTicketDetailsOpen}
        onClose={() => {
          setIsTicketDetailsOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        currentUser={user}
        onFinalize={handleFinalizeTicket}
        onStatusChange={handleUpdateTicketStatus}
      />

      <AtribuirChamado
        isOpen={isAtribuirOpen}
        onClose={() => {
          setIsAtribuirOpen(false);
          setSelectedTecnico(null);
        }}
        tecnico={selectedTecnico}
        chamados={newTickets}
        onAssign={handleAssignTicket}
      />
    </div>
  );
}
