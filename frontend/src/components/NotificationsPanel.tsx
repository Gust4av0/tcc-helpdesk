import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './notifications-panel.css';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    message: 'Usuário Carlos Mendes abriu um chamado',
    time: 'há 2 minutos',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    message: 'Chamado #2847 foi atribuído',
    time: 'há 15 minutos',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    message: 'Chamado #2843 foi finalizado',
    time: 'há 1 hora',
    read: false,
  },
  {
    id: '4',
    type: 'error',
    message: 'Chamado #2844 está atrasado no SLA',
    time: 'há 2 horas',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    message: 'Usuário Ana Paula atualizou um chamado',
    time: 'há 3 horas',
    read: true,
  },
  {
    id: '6',
    type: 'success',
    message: 'Técnico Roberto Lima foi adicionado',
    time: 'há 4 horas',
    read: true,
  },
  {
    id: '7',
    type: 'info',
    message: 'Nova categoria "Segurança" criada',
    time: 'há 5 horas',
    read: true,
  },
];

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleRemoveNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  return (
    <div className="notifications-wrapper" ref={panelRef}>
      <button
        className={`notifications-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={handleToggle}
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notificações</h3>
            {unreadCount > 0 && (
              <button
                className="notifications-mark-all-btn"
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="notifications-empty">
                <Bell className="notifications-empty-icon" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map(notification => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className={`notification-icon ${notification.type}`}>
                      <Icon />
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    <button
                      className="notification-remove-btn"
                      onClick={(e) => handleRemoveNotification(notification.id, e)}
                      aria-label="Remover notificação"
                    >
                      <X />
                    </button>
                    {!notification.read && <div className="notification-unread-dot"></div>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
