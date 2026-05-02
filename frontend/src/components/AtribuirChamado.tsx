import { X, AlertCircle, User, Calendar, Link } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../components/Toast/ToastContext';
import './atribuir-chamado.css';

interface AtribuirChamadoProps {
  isOpen: boolean;
  onClose: () => void;
  tecnico: {
    id: number;
    nome: string;
    email: string;
  } | null;
}

interface ChamadoNaoAtribuido {
  id: string;
  titulo: string;
  categoria: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  dataAbertura: string;
  cliente: string;
}

const chamadosNaoAtribuidos: ChamadoNaoAtribuido[] = [
  {
    id: '#2847',
    titulo: 'Computador não liga',
    categoria: 'Hardware',
    prioridade: 'Alta',
    dataAbertura: '09/03/2026',
    cliente: 'Tech Solutions Ltda',
  },
  {
    id: '#2841',
    titulo: 'Não consigo acessar o sistema',
    categoria: 'Acesso',
    prioridade: 'Urgente',
    dataAbertura: '06/03/2026',
    cliente: 'Prime Services',
  },
  {
    id: '#2839',
    titulo: 'Impressora offline',
    categoria: 'Hardware',
    prioridade: 'Média',
    dataAbertura: '05/03/2026',
    cliente: 'Consultoria Business',
  },
  {
    id: '#2836',
    titulo: 'VPN não conecta',
    categoria: 'Rede',
    prioridade: 'Alta',
    dataAbertura: '04/03/2026',
    cliente: 'Innovation Tech',
  },
  {
    id: '#2833',
    titulo: 'E-mail não está enviando',
    categoria: 'E-mail',
    prioridade: 'Média',
    dataAbertura: '03/03/2026',
    cliente: 'Marketing Digital SA',
  },
];

export function AtribuirChamado({ isOpen, onClose, tecnico }: AtribuirChamadoProps) {
  const [selectedChamado, setSelectedChamado] = useState<string | null>(null);
  const { addToast } = useToast();

  if (!isOpen || !tecnico) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAtribuir = () => {
    if (!selectedChamado) {
      addToast('warning', 'Selecione um chamado primeiro');
      return;
    }

    console.log(`Atribuindo chamado ${selectedChamado} ao técnico ${tecnico.nome}`);

    addToast('success', `Chamado ${selectedChamado} atribuído a ${tecnico.nome}`);

    setSelectedChamado(null);
    onClose();
  };

  const prioridadeClassMap = {
    'Baixa': 'baixa',
    'Média': 'media',
    'Alta': 'alta',
    'Urgente': 'urgente',
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
            <span className="atribuir-badge">{chamadosNaoAtribuidos.length}</span>
          </div>

          <div className="atribuir-chamados-list">
            {chamadosNaoAtribuidos.map((chamado) => (
              <div
                key={chamado.id}
                className={`atribuir-chamado-card ${selectedChamado === chamado.id ? 'selected' : ''}`}
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
                    <span className={`prioridade-badge ${prioridadeClassMap[chamado.prioridade]}`}>
                      {chamado.prioridade}
                    </span>
                  </div>

                  <div className="atribuir-chamado-titulo">{chamado.titulo}</div>

                  <div className="atribuir-chamado-meta">
                    <span>{chamado.categoria}</span>
                    <span>•</span>
                    <span>{chamado.cliente}</span>
                  </div>

                  <div className="atribuir-chamado-data">
                    <Calendar className="icon-small" />
                    Aberto em {chamado.dataAbertura}
                  </div>
                </div>
              </div>
            ))}
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