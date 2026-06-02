import { useState } from "react";
import { Bell, User, LogOut } from "lucide-react";
import "./topbar.css";

interface TopBarProps {
  user?: {
    nome: string;
    tipo: string;
  } | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  newTicketsCount?: number;
  onOpenNewTickets?: () => void;
}

export function TopBar({
  user,
  onLogout,
  onOpenProfile,
  newTicketsCount = 0,
  onOpenNewTickets,
}: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const displayName = user?.nome ?? "Usuário";
  const displayRole = user?.tipo ?? "Convidado";
  const canReceiveTicketNotifications =
    user?.tipo === "ADMIN" || user?.tipo === "SUPORTE";
  const notificationLabel =
    newTicketsCount === 1
      ? "1 chamado novo aguardando atribuição"
      : `${newTicketsCount} chamados novos aguardando atribuição`;

  return (
    <header className="topbar">
      <div className="topbar-actions">
        {canReceiveTicketNotifications && (
          <button
            type="button"
            className={`topbar-notification-btn ${
              newTicketsCount > 0 ? "has-notifications" : ""
            }`}
            onClick={onOpenNewTickets}
            aria-label={notificationLabel}
            title={notificationLabel}
          >
            <Bell />
            {newTicketsCount > 0 && (
              <span className="topbar-notification-badge">
                {newTicketsCount > 99 ? "99+" : newTicketsCount}
              </span>
            )}
          </button>
        )}

        <div className="topbar-user-wrapper">
          <div
            className="topbar-user-info"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <p className="topbar-user-name">{displayName}</p>
            <p className="topbar-user-role">{displayRole}</p>
          </div>

          <button
            type="button"
            className="topbar-user-avatar"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <User />
          </button>

          {isMenuOpen && (
            <div className="topbar-dropdown">
              <div className="dropdown-user">
                <div className="dropdown-avatar">
                  <User />
                </div>
                <div>
                  <p>{displayName}</p>
                  <span>{displayRole}</span>
                </div>
              </div>
              <div className="dropdown-divider" />
              {onOpenProfile && (
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    onOpenProfile();
                    setIsMenuOpen(false);
                  }}
                >
                  <User />
                  Meu Perfil
                </button>
              )}
              {onLogout && (
                <button
                  type="button"
                  className="dropdown-item logout"
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut />
                  Sair
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
