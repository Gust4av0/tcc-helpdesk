import { useEffect, useState } from "react";
import { AlertCircle, Calendar, Tag, UserRound } from "lucide-react";
import {
  listTickets,
  assignTicket,
  finalizeTicket,
  Chamado,
} from "../../services/ticket";
import { AuthUser } from "../../services/auth";
import { Usuario } from "../../services/user";
import { useToast } from "../../components/Toast/ToastContext";
import "./meus-chamados.css";

type FilterStatus =
  | "todos"
  | "Abertos"
  | "Em Atendimento"
  | "Finalizado"
  | "Fechado";

interface MeusChamadosProps {
  user: AuthUser | null;
  tecnicos?: Usuario[];
  openTicketsFocusKey?: number;
  onTicketChanged?: () => void;
}

function normalizeClass(value?: string) {
  return value
    ? value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/_+/g, "-")
    : "";
}

function formatDate(value?: string) {
  if (!value) return "N/D";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

function getOpeningDate(ticket: Chamado) {
  if (ticket.data_abertura || ticket.created_at) {
    return ticket.data_abertura ?? ticket.created_at;
  }

  if (ticket.prazo_resolucao && ticket.categoria?.sla_resolucao) {
    const abertura = new Date(ticket.prazo_resolucao);
    abertura.setHours(abertura.getHours() - ticket.categoria.sla_resolucao);
    return abertura.toISOString();
  }

  return undefined;
}

const statusLabelMap: Record<string, string> = {
  NOVO: "NOVO",
  ATRIBUIDO: "ATRIBUIDO",
  EM_ATENDIMENTO: "EM ATENDIMENTO",
  FINALIZADO: "FINALIZADO",
  FECHADO: "FECHADO",
};

const prioridadeLabelMap: Record<string, string> = {
  BAIXA: "BAIXA",
  MEDIA: "MEDIA",
  ALTA: "ALTA",
  URGENTE: "URGENTE",
};

export function MeusChamados({
  user,
  tecnicos = [],
  openTicketsFocusKey = 0,
  onTicketChanged,
}: MeusChamadosProps) {
  const [tickets, setTickets] = useState<Chamado[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [selectedTechnicians, setSelectedTechnicians] = useState<
    Record<number, string>
  >({});

  const { addToast } = useToast();

  const loadTickets = async () => {
    try {
      const result = await listTickets(1, 100);
      const allTickets = result.data;

      if (!user) {
        setTickets(allTickets);
        return;
      }

      const filtered = allTickets.filter((ticket) => {
        if (user.tipo === "CLIENTE") {
          return ticket.usuario_id === user.id;
        }

        if (user.tipo === "SUPORTE") {
          return ticket.status === "NOVO" || ticket.tecnico_id === user.id;
        }

        return true;
      });

      setTickets(filtered);
    } catch {
      setTickets([]);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  useEffect(() => {
    if (openTicketsFocusKey > 0) {
      setFilterStatus("Abertos");
    }
  }, [openTicketsFocusKey]);

  const handleAssignToMe = async (ticketId: number) => {
    try {
      await assignTicket(ticketId, user!.id);
      addToast("success", "Chamado atribuído a você com sucesso");
      loadTickets();
      onTicketChanged?.();
    } catch (error: any) {
      addToast("error", error?.message || "Erro ao atribuir chamado");
    }
  };

  const handleAssignToTechnician = async (ticketId: number) => {
    const tecnicoId = Number(selectedTechnicians[ticketId]);

    if (!tecnicoId) {
      addToast("warning", "Selecione um técnico para atribuir o chamado");
      return;
    }

    const tecnico = tecnicos.find((item) => item.id === tecnicoId);

    try {
      await assignTicket(ticketId, tecnicoId);
      addToast(
        "success",
        `Chamado atribuído a ${tecnico?.nome ?? "técnico"} com sucesso`,
      );
      setSelectedTechnicians((current) => {
        const next = { ...current };
        delete next[ticketId];
        return next;
      });
      loadTickets();
      onTicketChanged?.();
    } catch (error: any) {
      addToast("error", error?.message || "Erro ao atribuir chamado");
    }
  };

  const handleFinalizeTicket = async (ticketId: number) => {
    try {
      await finalizeTicket(ticketId);
      addToast("success", "Chamado finalizado com sucesso");
      loadTickets();
      onTicketChanged?.();
    } catch (error: any) {
      addToast("error", error?.message || "Erro ao finalizar chamado");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "todos") return true;
    if (filterStatus === "Abertos") {
      return ticket.status === "NOVO";
    }
    if (filterStatus === "Em Atendimento") {
      return ticket.status === "ATRIBUIDO" || ticket.status === "EM_ATENDIMENTO";
    }
    if (filterStatus === "Finalizado") {
      return ticket.status === "FINALIZADO";
    }
    if (filterStatus === "Fechado") {
      return ticket.status === "FECHADO";
    }
    return true;
  });

  const totalAbertos = tickets.filter(
    (ticket) => ticket.status === "NOVO",
  ).length;
  const totalEmAtendimento = tickets.filter(
    (ticket) =>
      ticket.status === "ATRIBUIDO" || ticket.status === "EM_ATENDIMENTO",
  ).length;
  const totalFinalizados = tickets.filter(
    (ticket) => ticket.status === "FINALIZADO",
  ).length;
  const totalFechados = tickets.filter(
    (ticket) => ticket.status === "FECHADO",
  ).length;

  return (
    <div className="meus-chamados-container">
      <div className="meus-chamados-header">
        <div>
          <h1>Chamados</h1>
          <p>Acompanhe o status dos seus chamados</p>
        </div>
      </div>

      <div className="meus-chamados-filters">
        <button
          className={`filter-tab ${filterStatus === "todos" ? "active" : ""}`}
          onClick={() => setFilterStatus("todos")}
        >
          <span>Todos</span>
          <span className="filter-count">{tickets.length}</span>
        </button>
        <button
          className={`filter-tab ${filterStatus === "Abertos" ? "active" : ""}`}
          onClick={() => setFilterStatus("Abertos")}
        >
          <span>Abertos</span>
          <span className="filter-count">{totalAbertos}</span>
        </button>
        <button
          className={`filter-tab ${
            filterStatus === "Em Atendimento" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("Em Atendimento")}
        >
          <span>Em Atendimento</span>
          <span className="filter-count">{totalEmAtendimento}</span>
        </button>
        <button
          className={`filter-tab ${
            filterStatus === "Finalizado" ? "active" : ""
          }`}
          onClick={() => setFilterStatus("Finalizado")}
        >
          <span>Finalizados</span>
          <span className="filter-count">{totalFinalizados}</span>
        </button>
        <button
          className={`filter-tab ${filterStatus === "Fechado" ? "active" : ""}`}
          onClick={() => setFilterStatus("Fechado")}
        >
          <span>Fechados</span>
          <span className="filter-count">{totalFechados}</span>
        </button>
      </div>

      <div className="meus-chamados-list">
        {filteredTickets.length === 0 ? (
          <div className="meus-chamados-empty">Nenhum chamado encontrado</div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="meus-chamados-card">
              <div className="chamado-card-header">
                <div className="chamado-title-area">
                  <span className="chamado-id">Chamado #{ticket.id}</span>
                  <h3>{ticket.titulo}</h3>
                </div>
                <div className="chamado-badges">
                  <span className={`status-badge ${normalizeClass(ticket.status)}`}>
                    {statusLabelMap[ticket.status] ?? ticket.status}
                  </span>
                  <span
                    className={`prioridade-badge ${normalizeClass(ticket.prioridade)}`}
                  >
                    {prioridadeLabelMap[ticket.prioridade] ?? ticket.prioridade}
                  </span>
                </div>
              </div>

              <div className="chamado-card-body">
                <div className="chamado-description-block">
                  <label>Descricao</label>
                  <p>{ticket.descricao}</p>
                </div>

                <div className="chamado-info-grid">
                  <div className="chamado-info-item">
                    <label>Categoria</label>
                    <span>
                      <Tag className="icon-small" />
                      {ticket.categoria?.nome ?? "Categoria"}
                    </span>
                  </div>
                  <div className="chamado-info-item">
                    <label>Data de abertura</label>
                    <span>
                      <Calendar className="icon-small" />
                      {formatDate(getOpeningDate(ticket))}
                    </span>
                  </div>
                  <div className="chamado-info-item">
                    <label>SLA de solucao</label>
                    <span>
                      <AlertCircle className="icon-small" />
                      {formatDate(ticket.prazo_resolucao)}
                    </span>
                  </div>
                  <div className="chamado-info-item">
                    <label>Tecnico</label>
                    <span>
                      <UserRound className="icon-small" />
                      {ticket.tecnico?.nome ?? "Nao atribuido"}
                    </span>
                  </div>
                </div>
              </div>

              {user?.tipo === "SUPORTE" &&
                ticket.status === "NOVO" &&
                !ticket.tecnico_id && (
                  <div className="chamado-card-actions">
                    <button
                      type="button"
                      className="atribuir-mim-btn"
                      onClick={() => handleAssignToMe(Number(ticket.id))}
                    >
                      Atribuir a mim
                    </button>
                  </div>
                )}

              {user?.tipo === "ADMIN" &&
                ticket.status === "NOVO" &&
                !ticket.tecnico_id && (
                  <div className="chamado-card-actions admin-assign-actions">
                    <select
                      className="admin-assign-select"
                      value={selectedTechnicians[ticket.id] ?? ""}
                      onChange={(event) =>
                        setSelectedTechnicians((current) => ({
                          ...current,
                          [ticket.id]: event.target.value,
                        }))
                      }
                    >
                      <option value="">Selecionar técnico</option>
                      {tecnicos.map((tecnico) => (
                        <option key={tecnico.id} value={tecnico.id}>
                          {tecnico.nome}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="atribuir-mim-btn"
                      onClick={() =>
                        handleAssignToTechnician(Number(ticket.id))
                      }
                    >
                      Atribuir técnico
                    </button>
                  </div>
                )}

              {(user?.tipo === "SUPORTE" || user?.tipo === "ADMIN") &&
                (ticket.status === "ATRIBUIDO" ||
                  ticket.status === "EM_ATENDIMENTO") &&
                (user.tipo === "ADMIN" || ticket.tecnico_id === user.id) && (
                  <div className="chamado-card-actions">
                    <button
                      type="button"
                      className="finalizar-btn"
                      onClick={() => handleFinalizeTicket(Number(ticket.id))}
                    >
                      Finalizar
                    </button>
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
