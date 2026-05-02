import { useState, useEffect } from 'react';
import { User, Mail, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import './usuarios-cadastrados.css';

interface UsuariosCadastradosProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: 'Admin' | 'Técnico' | 'Cliente';
}

const mockUsuarios: Usuario[] = [
  { id: 1, nome: 'João Silva', email: 'joao.silva@empresa.com', cargo: 'Admin' },
  { id: 2, nome: 'Maria Santos', email: 'maria.santos@empresa.com', cargo: 'Admin' },
  { id: 3, nome: 'Carlos Mendes', email: 'carlos.mendes@helpdesk.com', cargo: 'Técnico' },
  { id: 4, nome: 'Ana Paula Silva', email: 'ana.paula@helpdesk.com', cargo: 'Técnico' },
  { id: 5, nome: 'Roberto Lima', email: 'roberto.lima@helpdesk.com', cargo: 'Técnico' },
  { id: 6, nome: 'Pedro Costa', email: 'pedro.costa@empresa.com', cargo: 'Cliente' },
  { id: 7, nome: 'Juliana Oliveira', email: 'juliana.oliveira@empresa.com', cargo: 'Cliente' },
  { id: 8, nome: 'Fernando Alves', email: 'fernando.alves@empresa.com', cargo: 'Cliente' },
  { id: 9, nome: 'Patricia Souza', email: 'patricia.souza@empresa.com', cargo: 'Cliente' },
  { id: 10, nome: 'Ricardo Pereira', email: 'ricardo.pereira@empresa.com', cargo: 'Cliente' },
];

export function UsuariosCadastrados({ isOpen, onClose }: UsuariosCadastradosProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [activeDropdown]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getBadgeClass = (cargo: string) => {
    switch (cargo) {
      case 'Admin':
        return 'usuario-badge-admin';
      case 'Técnico':
        return 'usuario-badge-tecnico';
      case 'Cliente':
        return 'usuario-badge-cliente';
      default:
        return '';
    }
  };

  const toggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleEditar = (usuarioId: number) => {
    console.log('Editar usuário', usuarioId);
    setActiveDropdown(null);
    
  };

  const handleExcluir = (usuarioId: number) => {
    console.log('Excluir usuário', usuarioId);
    setActiveDropdown(null);
    
  };

  return (
    <div className="usuarios-overlay" onClick={handleOverlayClick}>
      <div className="usuarios-container">
        <div className="usuarios-header">
          <h2>Usuários Cadastrados</h2>
          <button
            onClick={onClose}
            className="usuarios-close-btn"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="usuarios-body">
          <div className="usuarios-list">
            {mockUsuarios.map((usuario) => (
              <div key={usuario.id} className="usuario-card">
                <div className="usuario-avatar">
                  <User />
                </div>
                <div className="usuario-info">
                  <div className="usuario-id">ID: {usuario.id}</div>
                  <h3>{usuario.nome}</h3>
                  <div className="usuario-email">
                    <Mail />
                    <span>{usuario.email}</span>
                  </div>
                </div>
                <div className={`usuario-badge ${getBadgeClass(usuario.cargo)}`}>
                  {usuario.cargo}
                </div>
                <div className="usuario-actions">
                  <button
                    className="usuario-menu-btn"
                    onClick={(e) => toggleDropdown(e, usuario.id)}
                    aria-label="Opções"
                  >
                    <MoreVertical />
                  </button>
                  {activeDropdown === usuario.id && (
                    <div className="usuario-dropdown">
                      <button
                        className="usuario-dropdown-item"
                        onClick={() => handleEditar(usuario.id)}
                      >
                        <Edit2 />
                        <span>Editar usuário</span>
                      </button>
                      <button
                        className="usuario-dropdown-item usuario-dropdown-item-delete"
                        onClick={() => handleExcluir(usuario.id)}
                      >
                        <Trash2 />
                        <span>Excluir usuário</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
