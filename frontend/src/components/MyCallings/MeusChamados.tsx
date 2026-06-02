import { useEffect, useState } from "react";
import { AlertCircle, Calendar, Search, Tag, UserRound, Zap } from "lucide-react";
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
  onTicketClick?: (ticket: Chamado) => void;
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

function formatDeadlineDistance(value?: string) {
  if (!value) return "SLA não definido";
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return "SLA inválido";

  const diffMs = deadline.getTime() - Date.now();
  const absHours = Math.max(1, Math.ceil(Math.abs(diffMs) / 3600000));
  const days = Math.floor(absHours / 24);
  const hours = absHours % 24;
  const time =
    days > 0
      ? `${days}d${hours > 0 ? ` ${hours}h` : ""}`
      : `${absHours}h`;

  return diffMs < 0 ? `Atrasado há ${time}` : `Vence em ${time}`;
}

function getSlaClass(value?: string, status?: string) {
  if (["FINALIZADO", "FECHADO"].includes(status ?? "")) return "ok";
  if (!value) return "";
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return "";
  const hoursRemaining = (deadline.getTime() - Date.now()) / 3600000;
  if (hoursRemaining < 0) return "danger";
  if (hoursRemaining <= 24) return "warning";
  return "ok";
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
  ATRIBUIDO: "ATRIBUÍDO",
  EM_ATENDIMENTO: "EM ATENDIMENTO",
  FINALIZADO: "FINALIZADO",
  FECHADO: "FECHADO",
};

const prioridadeLabelMap: Record<string, string> = {
  BAIXA: "BAIXA",
  MEDIA: "MÉDIA",
  ALTA: "ALTA",
  URGENTE: "URGENTE",
};

const priorityRank: Record<string, number> = {
  URGENTE: 0,
  ALTA: 1,
  MEDIA: 2,
  BAIXA: 3,
};

export function MeusChamados({
  user,
  tecnicos = [],
  openTicketsFocusKey = 0,
  onTicketClick,
  onTicketChanged,
}: MeusChamadosProps) {
  const [tickets, setTickets] = useState<Chamado[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleAssignNextTicket = async () => {
    const nextTicket = tickets
      .filter((ticket) => ticket.status === "NOVO" && !ticket.tecnico_id)
      .sort((a, b) => {
        const priorityA = priorityRank[a.prioridade] ?? 99;
        const priorityB = priorityRank[b.prioridade] ?? 99;
        if (priorityA !== priorityB) return priorityA - priorityB;

        return (
          new Date(a.prazo_resolucao).getTime() -
          new Date(b.prazo_resolucao).getTime()
        );
      })[0];

    if (!nextTicket) {
      addToast("warning", "Não há chamados novos disponíveis para assumir.");
      return;
    }

    await handleAssignToMe(Number(nextTicket.id));
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

  const filteredTickets = tickets
    .filter((ticket) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const searchable = [
        ticket.id,
        ticket.titulo,
        ticket.descricao,
        ticket.categoria?.nome,
        ticket.usuario?.nome,
        ticket.tecnico?.nome,
        ticket.status,
        ticket.prioridade,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (normalizedSearch && !searchable.includes(normalizedSearch)) {
        return false;
      }

      if (filterStatus === "todos") return true;
      if (filterStatus === "Abertos") return ticket.status === "NOVO";
      if (filterStatus === "Em Atendimento") {
        return ticket.status === "ATRIBUIDO" || ticket.status === "EM_ATENDIMENTO";
      }
      if (filterStatus === "Finalizado") return ticket.status === "FINALIZADO";
      if (filterStatus === "Fechado") return ticket.status === "FECHADO";
      return true;
    })
    .sort((a, b) => {
      const priorityA = priorityRank[a.prioridade] ?? 99;
      const priorityB = priorityRank[b.prioridade] ?? 99;
      if (priorityA !== priorityB) return priorityA - priorityB;

      return (
        new Date(a.prazo_resolucao).getTime() -
        new Date(b.prazo_resolucao).getTime()
      );
    });

  const totalAbertos = tickets.filter((ticket) => ticket.status === "NOVO").length;
  const totalEmAtendimento = tickets.filter(
    (ticket) =>
      ticket.status === "ATRIBUIDO" || ticket.status === "EM_ATENDIMENTO",
  ).length;
  const totalFinalizados = tickets.filter(
    (ticket) => ticket.status === "FINALIZADO",
  ).length;
  const totalFechados = tickets.filter((ticket) => ticket.status === "FECHADO").length;

  return (
    <div className="meus-chamados-container">
      <div className="meus-chamados-header">
        <div>
          <h1>Chamados</h1>
          <p>Acompanhe o status dos seus chamados</p>
        </div>
        {user?.tipo === "SUPORTE" && (
          <button
            type="button"
            className="assumir-proximo-btn"
            onClick={handleAssignNextTicket}
          >
            <Zap />
            Assumir próximo chamado
          </button>
        )}
      </div>

      <div className="meus-chamados-toolbar">
        <div className="meus-chamados-search">
          <Search />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por ID, título, categoria ou responsável"
            aria-label="Buscar chamados"
          />
        </div>
        <span>{filteredTickets.length} chamado(s) na lista</span>
      </div>

      <div className="meus-chamados-filters">
        {[
          ["todos", "Todos", tickets.length],
          ["Abertos", "Abertos", totalAbertos],
          ["Em Atendimento", "Em Atendimento", totalEmAtendimento],
          ["Finalizado", "Finalizados", totalFinalizados],
          ["Fechado", "Fechados", totalFechados],
        ].map(([value, label, count]) => (
          <button
            key={String(value)}
            className={`filter-tab ${filterStatus === value ? "active" : ""}`}
            onClick={() => setFilterStatus(value as FilterStatus)}
          >
            <span>{label}</span>
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="meus-chamados-list">
        {filteredTickets.length === 0 ? (
          <div className="meus-chamados-empty">
            <strong>Nenhum chamado encontrado</strong>
            <span>Ajuste os filtros ou acompanhe novas solicitações por aqui.</span>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`meus-chamados-card sla-${getSlaClass(
                ticket.prazo_resolucao,
                ticket.status,
              )}`}
              onClick={() => onTicketClick?.(ticket)}
              role={onTicketClick ? "button" : undefined}
              tabIndex={onTicketClick ? 0 : undefined}
              onKeyDown={(event) => {
                if (onTicketClick && event.key === "Enter") {
                  onTicketClick(ticket);
                }
              }}
            >
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
                    className={`prioridade-badge ${normalizeClass(
                      ticket.prioridade,
                    )}`}
                  >
                    {prioridadeLabelMap[ticket.prioridade] ?? ticket.prioridade}
                  </span>
                </div>
              </div>

              <div className="chamado-card-body">
                <div className="chamado-description-block">
                  <label>Descrição</label>
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
                    <label>SLA de solução</label>
                    <span
                      className={`sla-text ${getSlaClass(
                        ticket.prazo_resolucao,
                        ticket.status,
                      )}`}
                    >
                      <AlertCircle className="icon-small" />
                      {formatDeadlineDistance(ticket.prazo_resolucao)}
                    </span>
                    <small>{formatDate(ticket.prazo_resolucao)}</small>
                  </div>
                  <div className="chamado-info-item">
                    <label>Técnico</label>
                    <span>
                      <UserRound className="icon-small" />
                      {ticket.tecnico?.nome ?? "Não atribuído"}
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
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAssignToMe(Number(ticket.id));
                      }}
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
                      onClick={(event) => event.stopPropagation()}
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
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAssignToTechnician(Number(ticket.id));
                      }}
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
                      onClick={(event) => {
                        event.stopPropagation();
                        handleFinalizeTicket(Number(ticket.id));
                      }}
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
