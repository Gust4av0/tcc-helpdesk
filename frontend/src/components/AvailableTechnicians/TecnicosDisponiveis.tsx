import { User, Mail, CheckCircle, Link } from "lucide-react";
import "./tecnicos-disponiveis.css";

type Tecnico = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
};

interface TecnicosDisponiveisProps {
  isOpen: boolean;
  onClose: () => void;
  tecnicos: Tecnico[];
  workloads?: Record<number, number>;
  onAtribuirClick?: (tecnico: Tecnico) => void;
}

export function TecnicosDisponiveis({
  isOpen,
  onClose,
  tecnicos,
  workloads = {},
  onAtribuirClick,
}: TecnicosDisponiveisProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAtribuir = (tecnico: Tecnico) => {
    if (onAtribuirClick) {
      onAtribuirClick(tecnico);
    }
  };

  return (
    <div className="tecnicos-overlay" onClick={handleOverlayClick}>
      <div className="tecnicos-container">
        <div className="tecnicos-header">
          <h2>Técnicos Disponíveis</h2>
          <button
            onClick={onClose}
            className="tecnicos-close-btn"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="tecnicos-body">
          <div className="tecnicos-list">
            {tecnicos.length === 0 ? (
              <div className="tecnico-empty-state">
                Nenhum técnico encontrado
              </div>
            ) : (
              tecnicos.map((tecnico) => (
                <div key={tecnico.id} className="tecnico-card">
                  <div className="tecnico-avatar">
                    <User />
                  </div>

                  <div className="tecnico-info">
                    <h3>{tecnico.nome}</h3>
                    <div className="tecnico-email">
                      <Mail />
                      <span>{tecnico.email}</span>
                    </div>
                  </div>

                  <div
                    className={`tecnico-status ${
                      workloads[tecnico.id] > 0 ? "busy" : ""
                    }`}
                  >
                    <CheckCircle />
                    <span>
                      {workloads[tecnico.id] > 0
                        ? `${workloads[tecnico.id]} ativo(s)`
                        : "Disponível"}
                    </span>
                  </div>

                  <button
                    className="tecnico-atribuir-btn"
                    onClick={() => handleAtribuir(tecnico)}
                  >
                    <Link />
                    <span>Atribuir a um chamado</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
