import { useState } from "react";
import { User, LogOut } from "lucide-react";
import { SearchBar } from "../../components/SearchBar";
import "./topbar.css";

interface TopBarProps {
  user?: {
    nome: string;
    tipo: string;
  } | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export function TopBar({ user, onLogout, onOpenProfile }: TopBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const displayName = user?.nome ?? "Usuário";
  const displayRole = user?.tipo ?? "Convidado";

  return (
    <header className="topbar">
      <div className="topbar-search-wrapper">
        <SearchBar />
      </div>

      <div className="topbar-actions">
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
