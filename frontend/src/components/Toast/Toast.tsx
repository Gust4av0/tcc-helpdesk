import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import type { Toast as ToastType } from './ToastContext';
import './toast.css';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
  };

  const Icon = icons[toast.type];

  return (
    <div className={`toast toast-${toast.type} ${isVisible ? 'toast-visible' : ''}`}>
      <div className="toast-icon">
        <Icon />
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={handleClose} aria-label="Fechar">
        <X />
      </button>
    </div>
  );
}