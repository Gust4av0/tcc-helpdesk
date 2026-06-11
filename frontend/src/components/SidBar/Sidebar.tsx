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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { AuthUser } from "../../services/auth";
import "./sidebar.css";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  user: AuthUser | null;
  unreadMessagesCount?: number;
}

export function Sidebar({
  activeItem,
  onItemClick,
  user,
  unreadMessagesCount = 0,
}: SidebarProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const canSeeTickets =
    user?.tipo === "ADMIN" ||
    user?.tipo === "SUPORTE" ||
    user?.tipo === "CLIENTE";

  const isAdmin = user?.tipo === "ADMIN";

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    ...(canSeeTickets
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
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand-mark">HD</div>

        <div className="sidebar-brand-text">
          <h1>HelpDesk</h1>
          <p>Sistema de Chamados</p>
        </div>

        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
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
                    title={item.label}
                    data-testid="sidebar-configuracoes"
                  >
                    <Icon />
                    <span>{item.label}</span>

                    <span className="sidebar-arrow">
                      {isOptionsOpen ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </button>

                  {isOptionsOpen && !isCollapsed && (
                    <div className="sidebar-submenu">
                      <button
                        className="sidebar-subitem"
                        onClick={() => onItemClick("cadastrar-categorias")}
                        data-testid="sidebar-cadastrar-categoria"
                      >
                        <FolderPlus />
                        <span>Adicionar Categoria</span>
                      </button>

                      <button
                        className="sidebar-subitem"
                        onClick={() => onItemClick("tecnicos-disponiveis")}
                        data-testid="sidebar-tecnicos-disponiveis"
                      >
                        <Users />
                        <span>Técnicos Disponíveis</span>
                      </button>

                      <button
                        className="sidebar-subitem"
                        onClick={() => onItemClick("usuarios-cadastrados")}
                        data-testid="sidebar-usuarios-cadastrados"
                      >
                        <User />
                        <span>Usuários Cadastrados</span>
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
                  className={`sidebar-menu-button ${
                    isActive ? "active" : ""
                  }`}
                  data-testid={`sidebar-${item.id}`}
                  title={item.label}
                >
                  <Icon />
                  <span>{item.label}</span>

                  {item.id === "chat" && unreadMessagesCount > 0 && (
                    <span className="sidebar-notification-badge">
                      {unreadMessagesCount > 9 ? "9+" : unreadMessagesCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}