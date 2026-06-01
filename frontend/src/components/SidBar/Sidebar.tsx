import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  Users,
  User,
} from "lucide-react";
import { AuthUser } from "../../services/auth";
import "./sidebar.css";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  user: AuthUser | null;
}

export function Sidebar({ activeItem, onItemClick, user }: SidebarProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const isAdmin = user?.tipo === "ADMIN";

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    ...(isAdmin
      ? [
          {
            id: "meus-chamados",
            label: "Meus Chamados",
            icon: ClipboardList,
          },
        ]
      : []),
    {
      id: "chat",
      label: "Mensagens",
      icon: MessageSquare,
    },
    ...(isAdmin
      ? [
          {
            id: "configuracoes",
            label: "Opções",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>HelpDesk</h1>
        <p>Sistema de Chamados</p>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            if (item.id === "configuracoes") {
              return (
                <li key={item.id} className="sidebar-menu-item">
                  <button
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                    className="sidebar-menu-button"
                  >
                    <Icon />
                    <span>{item.label}</span>

                    <span className="sidebar-arrow">
                      {isOptionsOpen ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </button>

                  {isOptionsOpen && (
                    <div className="sidebar-submenu">
                      <button
                        className="sidebar-subitem"
                        onClick={() => onItemClick("cadastrar-categorias")}
                      >
                        <FolderPlus />
                        Adicionar Categoria
                      </button>

                      <button
                        className="sidebar-subitem"
                        onClick={() => onItemClick("tecnicos-disponiveis")}
                      >
                        <Users />
                        Técnicos Disponíveis
                      </button>

                      <button
                        className="sidebar-subitem"
                        onClick={() => onItemClick("usuarios-cadastrados")}
                      >
                        <User />
                        Usuários Cadastrados
                      </button>
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={item.id} className="sidebar-menu-item">
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`sidebar-menu-button ${isActive ? "active" : ""}`}
                  data-testid={`sidebar-${item.id}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
