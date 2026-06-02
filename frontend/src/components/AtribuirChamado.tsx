import { X, AlertCircle, User, Calendar, Link } from "lucide-react";
import { useState } from "react";
import { useToast } from "./Toast/ToastContext";
import "./atribuir-chamado.css";

interface Tecnico {
  id: number;
  nome: string;
  email: string;
}

interface ChamadoAtribuivel {
  id: number | string;
  titulo: string;
  categoria?: string | { id?: number; nome: string };
  prioridade?: string;
  dataAbertura?: string;
  cliente?: string;
}

interface AtribuirChamadoProps {
  isOpen: boolean;
  onClose: () => void;
  tecnico: Tecnico | null;
  chamados: ChamadoAtribuivel[];
  onAssign: (ticketId: number | string) => Promise<void>;
}

export function AtribuirChamado({
  isOpen,
  onClose,
  tecnico,
  chamados,
  onAssign,
}: AtribuirChamadoProps) {
  const [selectedChamado, setSelectedChamado] = useState<
    number | string | null
  >(null);
  const { addToast } = useToast();

  if (!isOpen || !tecnico) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAtribuir = async () => {
    if (!selectedChamado) {
      addToast("warning", "Selecione um chamado primeiro");
      return;
    }

    try {
      await onAssign(selectedChamado);
      addToast(
        "success",
        `Chamado ${selectedChamado} atribuído a ${tecnico.nome}`,
      );
      setSelectedChamado(null);
      onClose();
    } catch (error: any) {
      addToast("error", error?.message || "Erro ao atribuir chamado");
    }
  };

  const prioridadeClassMap: Record<string, string> = {
    Baixa: "baixa",
    Média: "media",
    Alta: "alta",
    Urgente: "urgente",
  };

  return (
    <div className="atribuir-overlay" onClick={handleOverlayClick}>
      <div className="atribuir-container">
        <div className="atribuir-header">
          <div>
            <h2>Atribuir Chamado</h2>
            <p>Selecione um chamado para atribuir ao técnico {tecnico.nome}</p>
          </div>
          <button
            onClick={onClose}
            className="atribuir-close-btn"
            aria-label="Fechar"
          >
            <X />
          </button>
        </div>

        <div className="atribuir-body">
          <div className="atribuir-tecnico-info">
            <div className="atribuir-tecnico-avatar">
              <User />
            </div>
            <div>
              <div className="atribuir-tecnico-nome">{tecnico.nome}</div>
              <div className="atribuir-tecnico-email">{tecnico.email}</div>
            </div>
          </div>

          <div className="atribuir-divider"></div>

          <div className="atribuir-chamados-header">
            <AlertCircle />
            <h3>Chamados Não Atribuídos</h3>
            <span className="atribuir-badge">{chamados.length}</span>
          </div>

          <div className="atribuir-chamados-list">
            {chamados.length === 0 ? (
              <div className="atribuir-empty-state">
                Nenhum chamado disponível para atribuição
              </div>
            ) : (
              chamados.map((chamado) => (
                <div
                  key={chamado.id}
                  className={`atribuir-chamado-card ${selectedChamado === chamado.id ? "selected" : ""}`}
                  onClick={() => setSelectedChamado(chamado.id)}
                >
                  <div className="atribuir-chamado-radio">
                    <input
                      type="radio"
                      name="chamado"
                      checked={selectedChamado === chamado.id}
                      onChange={() => setSelectedChamado(chamado.id)}
                    />
                  </div>

                  <div className="atribuir-chamado-content">
                    <div className="atribuir-chamado-header-row">
                      <span className="atribuir-chamado-id">{chamado.id}</span>
                      <span
                        className={`prioridade-badge ${prioridadeClassMap[chamado.prioridade ?? "Baixa"]}`}
                      >
                        {chamado.prioridade ?? "Baixa"}
                      </span>
                    </div>

                    <div className="atribuir-chamado-titulo">
                      {chamado.titulo}
                    </div>

                    <div className="atribuir-chamado-meta">
                      <span>
                        {typeof chamado.categoria === "string"
                          ? chamado.categoria
                          : (chamado.categoria?.nome ?? "Categoria")}
                      </span>
                      <span>•</span>
                      <span>{chamado.cliente ?? "Cliente"}</span>
                    </div>

                    <div className="atribuir-chamado-data">
                      <Calendar className="icon-small" />
                      Aberto em {chamado.dataAbertura ?? "N/D"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="atribuir-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>

          <button
            onClick={handleAtribuir}
            className="btn-primary"
            disabled={!selectedChamado}
          >
            <Link />
            Atribuir Técnico
          </button>
        </div>
      </div>
    </div>
  );
}
