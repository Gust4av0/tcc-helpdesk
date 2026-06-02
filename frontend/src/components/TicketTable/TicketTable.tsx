import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import "./tickettable.css";

export interface Ticket {
  id: string | number;
  titulo: string;
  descricao: string;
  categoria?: string | { id?: number; nome: string };
  cliente?: string;
  status: "Novo" | "Atribuido" | "Em Atendimento" | "Finalizado" | string;
  prioridade: "Baixa" | "Media" | "Alta" | "Urgente" | string;
  sla?: "no-prazo" | "proximo" | "atrasado" | "finalizado" | string;
  slaRestante?: string;
  dataAbertura?: string;
  data_abertura?: string;
  created_at?: string;
  prazo_atendimento?: string;
  prazo_resolucao?: string;
  tecnico?: string | { id?: number; nome: string } | null;
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

const PAGE_SIZE = 5;

type SortKey =
  | "id"
  | "categoria"
  | "cliente"
  | "status"
  | "prioridade"
  | "sla"
  | "data"
  | "tecnico";
type SortDirection = "asc" | "desc";

const normalizeClass = (value?: string) =>
  value
    ? value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/_+/g, "-")
    : "";

function formatDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

function getCategoriaLabel(ticket: Ticket) {
  return typeof ticket.categoria === "string"
    ? ticket.categoria
    : ticket.categoria?.nome ?? "Categoria";
}

function getClienteLabel(ticket: Ticket) {
  return ticket.usuario?.nome ?? ticket.cliente ?? "Cliente";
}

function getTecnicoLabel(ticket: Ticket) {
  return typeof ticket.tecnico === "string"
    ? ticket.tecnico
    : ticket.tecnico?.nome ?? "Nao atribuido";
}

function getDataAbertura(ticket: Ticket) {
  return ticket.dataAbertura ?? ticket.data_abertura ?? ticket.created_at;
}

function getResolutionSla(ticket: Ticket) {
  if (["FINALIZADO", "FECHADO"].includes(ticket.status?.toUpperCase())) {
    return {
      className: "finalizado",
      label: "Concluido",
      date: ticket.prazo_resolucao,
      icon: CheckCircle2,
    };
  }

  const deadline = ticket.prazo_resolucao
    ? new Date(ticket.prazo_resolucao)
    : null;

  if (!deadline || Number.isNaN(deadline.getTime())) {
    return {
      className: ticket.sla ?? "",
      label: ticket.slaRestante ?? "N/A",
      date: undefined,
      icon: Clock,
    };
  }

  const hoursRemaining = (deadline.getTime() - Date.now()) / 3600000;

  if (hoursRemaining < 0) {
    return {
      className: "atrasado",
      label: "Atrasado",
      date: ticket.prazo_resolucao,
      icon: AlertCircle,
    };
  }

  if (hoursRemaining <= 24) {
    return {
      className: "proximo",
      label: "Proximo",
      date: ticket.prazo_resolucao,
      icon: Clock,
    };
  }

  return {
    className: "no-prazo",
    label: "No prazo",
    date: ticket.prazo_resolucao,
    icon: CheckCircle2,
  };
}

export function TicketTable({ tickets, onTicketClick }: TicketTableProps) {
  const displayTickets = tickets ?? [];
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [displayTickets.length, sortKey, sortDirection]);

  const sortedTickets = useMemo(() => {
    return [...displayTickets].sort((a, b) => {
      const getValue = (ticket: Ticket) => {
        if (sortKey === "id") return Number(ticket.id) || 0;
        if (sortKey === "categoria") return getCategoriaLabel(ticket);
        if (sortKey === "cliente") return getClienteLabel(ticket);
        if (sortKey === "status") return ticket.status ?? "";
        if (sortKey === "prioridade") return ticket.prioridade ?? "";
        if (sortKey === "sla") return ticket.prazo_resolucao ?? "";
        if (sortKey === "data") return getDataAbertura(ticket) ?? "";
        return getTecnicoLabel(ticket);
      };

      const aValue = getValue(a);
      const bValue = getValue(b);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue), "pt-BR", {
            numeric: true,
            sensitivity: "base",
          })
        : String(bValue).localeCompare(String(aValue), "pt-BR", {
            numeric: true,
            sensitivity: "base",
          });
    });
  }, [displayTickets, sortDirection, sortKey]);

  const totalPages = Math.ceil(sortedTickets.length / PAGE_SIZE);
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const renderSortButton = (key: SortKey, label: string) => (
    <button
      type="button"
      className="ticket-sort-btn"
      onClick={() => handleSort(key)}
    >
      {label}
      {sortKey === key &&
        (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
    </button>
  );

  return (
    <div className="ticket-table-container">
      <div className="ticket-table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>{renderSortButton("id", "ID")}</th>
              <th>{renderSortButton("categoria", "Categoria")}</th>
              <th>{renderSortButton("cliente", "Cliente")}</th>
              <th>{renderSortButton("status", "Status")}</th>
              <th>{renderSortButton("prioridade", "Prioridade")}</th>
              <th>{renderSortButton("sla", "SLA Solucao")}</th>
              <th>{renderSortButton("data", "Data")}</th>
              <th>{renderSortButton("tecnico", "Tecnico")}</th>
            </tr>
          </thead>

          <tbody>
            {sortedTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-tickets-row">
                  Nenhum chamado encontrado
                </td>
              </tr>
            ) : (
              paginatedTickets.map((ticket) => {
                const sla = getResolutionSla(ticket);
                const SlaIcon = sla.icon;

                return (
                  <tr
                    key={ticket.id}
                    onClick={() => onTicketClick?.(ticket)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{ticket.id}</td>
                    <td>{getCategoriaLabel(ticket)}</td>
                    <td>{getClienteLabel(ticket)}</td>

                    <td>
                      <span
                        className={`status-badge ${normalizeClass(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`prioridade-badge ${normalizeClass(
                          ticket.prioridade,
                        )}`}
                      >
                        {ticket.prioridade}
                      </span>
                    </td>

                    <td>
                      <div className={`sla-indicator ${sla.className}`}>
                        <SlaIcon />
                        <span>{sla.label}</span>
                        {sla.date && <small>{formatDate(sla.date)}</small>}
                      </div>
                    </td>

                    <td>{formatDate(getDataAbertura(ticket))}</td>
                    <td>{getTecnicoLabel(ticket)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="ticket-pagination">
          <span>
            Exibindo {paginatedTickets.length} de {sortedTickets.length} chamados
          </span>
          <div className="ticket-pagination-pages">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  className={page === currentPage ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
