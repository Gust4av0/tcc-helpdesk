import { User } from 'lucide-react';
import { SearchBar } from '../../components/SearchBar';
import { NotificationsPanel } from '../../components/NotificationsPanel';
import './topbar.css';

export function TopBar() {
  const user = {
    name: 'João Silva',
    role: 'Administrador'
  };

  return (
    <header className="topbar">
      <div className="topbar-search-wrapper">
        <SearchBar />
      </div>

      <div className="topbar-actions">
        <NotificationsPanel />

        <div className="topbar-user-wrapper">
          <div className="topbar-user-info">
            <p className="topbar-user-name">{user.name}</p>
            <p className="topbar-user-role">{user.role}</p>
          </div>

          <div className="topbar-user-avatar">
            <User />
          </div>
        </div>
      </div>
    </header>
  );
}