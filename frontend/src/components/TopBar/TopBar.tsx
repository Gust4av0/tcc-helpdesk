import { User, LogOut } from "lucide-react";
import { SearchBar } from "../../components/SearchBar";
import "./topbar.css";

interface TopBarProps {
  user?: {
    nome: string;
    tipo: string;
  } | null;
  onLogout?: () => void;
}

export function TopBar({ user, onLogout }: TopBarProps) {
  const displayName = user?.nome ?? "Usuário";
  const displayRole = user?.tipo ?? "Convidado";

  return (
    <header className="topbar">
      <div className="topbar-search-wrapper">
        <SearchBar />
      </div>

      <div className="topbar-actions">
        <div className="topbar-user-wrapper">
          <div className="topbar-user-info">
            <p className="topbar-user-name">{displayName}</p>
            <p className="topbar-user-role">{displayRole}</p>
          </div>

          <div className="topbar-user-avatar">
            <User />
          </div>

          {onLogout && (
            <button
              type="button"
              className="topbar-logout-btn"
              onClick={onLogout}
            >
              <LogOut />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
