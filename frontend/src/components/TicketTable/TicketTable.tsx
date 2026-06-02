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

function formatRelativeDeadline(value?: string) {
  if (!value) return "";
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return "";

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
      label: formatRelativeDeadline(ticket.prazo_resolucao) || "Atrasado",
      date: ticket.prazo_resolucao,
      icon: AlertCircle,
    };
  }

  if (hoursRemaining <= 24) {
    return {
      className: "proximo",
      label: formatRelativeDeadline(ticket.prazo_resolucao) || "Próximo",
      date: ticket.prazo_resolucao,
      icon: Clock,
    };
  }

  return {
    className: "no-prazo",
    label: formatRelativeDeadline(ticket.prazo_resolucao) || "No prazo",
    date: ticket.prazo_resolucao,
    icon: CheckCircle2,
  };
}

function getSlaProgress(ticket: Ticket) {
  if (!ticket.prazo_resolucao) return 0;
  const end = new Date(ticket.prazo_resolucao).getTime();
  if (Number.isNaN(end)) return 0;

  const startValue = getDataAbertura(ticket);
  const start = startValue ? new Date(startValue).getTime() : Date.now();
  if (Number.isNaN(start) || end <= start) return 100;

  return Math.min(
    100,
    Math.max(0, Math.round(((Date.now() - start) / (end - start)) * 100)),
  );
}

export function TicketTable({ tickets, onTicketClick }: TicketTableProps) {
  const displayTickets = tickets ?? [];
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const totalPages = Math.ceil(sortedTickets.length / pageSize);
  const paginatedTickets = sortedTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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
                    className={`ticket-row priority-${normalizeClass(
                      ticket.prioridade,
                    )}`}
                    onClick={() => onTicketClick?.(ticket)}
                    style={{ cursor: "pointer" }}
                  >
                    <td data-label="ID">
                      <span className="ticket-id">#{ticket.id}</span>
                    </td>
                    <td data-label="Categoria">{getCategoriaLabel(ticket)}</td>
                    <td data-label="Cliente">{getClienteLabel(ticket)}</td>

                    <td data-label="Status">
                      <span
                        className={`status-badge ${normalizeClass(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td data-label="Prioridade">
                      <span
                        className={`prioridade-badge ${normalizeClass(
                          ticket.prioridade,
                        )}`}
                      >
                        {ticket.prioridade}
                      </span>
                    </td>

                    <td data-label="SLA Solução">
                      <div className={`sla-indicator ${sla.className}`}>
                        <SlaIcon />
                        <span>{sla.label}</span>
                        {sla.date && <small>{formatDate(sla.date)}</small>}
                      </div>
                      <div className={`sla-progress ${sla.className}`}>
                        <span style={{ width: `${getSlaProgress(ticket)}%` }} />
                      </div>
                    </td>

                    <td data-label="Data">{formatDate(getDataAbertura(ticket))}</td>
                    <td data-label="Técnico">{getTecnicoLabel(ticket)}</td>
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
          <div className="ticket-pagination-controls">
            <label>
              Itens
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </label>
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
        </div>
      )}
    </div>
  );
}
