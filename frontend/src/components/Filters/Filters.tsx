import { Filter } from 'lucide-react';
import './filters.css';

interface FiltersProps {
  statusFilter: string;
  prioridadeFilter: string;
  dataFilter: string;
  onStatusChange: (value: string) => void;
  onPrioridadeChange: (value: string) => void;
  onDataChange: (value: string) => void;
}

export function Filters({
  statusFilter,
  prioridadeFilter,
  dataFilter,
  onStatusChange,
  onPrioridadeChange,
  onDataChange,
}: FiltersProps) {
  return (
    <div className="filters-container">
      <div className="filters-wrapper">
        <div className="filters-label">
          <Filter />
          <span>Filtros:</span>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="novo">Novo</option>
            <option value="atribuido">Atribuído</option>
            <option value="em-atendimento">Em Atendimento</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="prioridade">Prioridade:</label>
          <select
            id="prioridade"
            value={prioridadeFilter}
            onChange={(e) => onPrioridadeChange(e.target.value)}
            className="filter-select"
          >
            <option value="todas">Todas</option>
            <option value="urgente">Urgente</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="data">Data:</label>
          <select
            id="data"
            value={dataFilter}
            onChange={(e) => onDataChange(e.target.value)}
            className="filter-select"
          >
            <option value="todas">Todas</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Última semana</option>
            <option value="mes">Último mês</option>
          </select>
        </div>
      </div>
    </div>
  );
}
