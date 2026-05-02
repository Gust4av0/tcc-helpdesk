import { User, Mail, CheckCircle, Link } from 'lucide-react';
import './tecnicos-disponiveis.css';

type Tecnico = {
  id: number;
  nome: string;
  email: string;
  status: string;
};

interface TecnicosDisponiveisProps {
  isOpen: boolean;
  onClose: () => void;
  onAtribuirClick?: (tecnico: Tecnico) => void;
}

const mockTecnicos: Tecnico[] = [
  { id: 1, nome: 'Carlos Mendes', email: 'carlos.mendes@helpdesk.com', status: 'Disponível' },
  { id: 2, nome: 'Ana Paula Silva', email: 'ana.paula@helpdesk.com', status: 'Disponível' },
  { id: 3, nome: 'Roberto Lima', email: 'roberto.lima@helpdesk.com', status: 'Disponível' },
  { id: 4, nome: 'Juliana Santos', email: 'juliana.santos@helpdesk.com', status: 'Disponível' },
  { id: 5, nome: 'Fernando Costa', email: 'fernando.costa@helpdesk.com', status: 'Disponível' },
];

export function TecnicosDisponiveis({
  isOpen,
  onClose,
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
            {mockTecnicos.map((tecnico) => (
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

                
                <div className="tecnico-status">
                  <CheckCircle />
                  <span>{tecnico.status}</span>
                </div>

               
                <button
                  className="tecnico-atribuir-btn"
                  onClick={() => handleAtribuir(tecnico)}
                >
                  <Link />
                  <span>Atribuir a um chamado</span>
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}