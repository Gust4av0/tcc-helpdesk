import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
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

type FilterStatus = "todos" | "Abertos" | "Em Atendimento" | "Finalizado";

interface MeusChamadosProps {
  user: AuthUser | null;
  tecnicos?: Usuario[];
  openTicketsFocusKey?: number;
  onTicketChanged?: () => void;
}

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
      </div>

      <div className="meus-chamados-list">
        {filteredTickets.length === 0 ? (
          <div className="meus-chamados-empty">Nenhum chamado encontrado</div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="meus-chamados-card">
              <div className="chamado-card-header">
                <h3>{ticket.titulo}</h3>
                <span
                  className={`status-badge ${ticket.status
                    .toLowerCase()
                    .replace(/\s/g, "-")
                    .replace(/_/g, "-")}`}
                >
                  {ticket.status}
                </span>
              </div>
              <p>{ticket.descricao}</p>
              <div className="chamado-card-meta">
                <span>{ticket.categoria?.nome ?? "Categoria"}</span>
                <span>{ticket.prioridade ?? "Prioridade"}</span>
                <span>
                  <Calendar className="icon-small" />{" "}
                  {ticket.prazo_atendimento
                    ? new Date(ticket.prazo_atendimento).toLocaleDateString()
                    : "N/D"}
                </span>
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
