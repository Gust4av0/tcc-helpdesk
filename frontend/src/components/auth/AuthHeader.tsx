import "./authheader.css";

interface AuthHeaderProps {
  compact?: boolean;
}

export function AuthHeader({ compact = false }: AuthHeaderProps) {
  return (
    <div className={`auth-header ${compact ? "compact" : ""}`}>
      <div className="auth-window-bar" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="auth-logo">
        <span>Gestão de chamados</span>
        <h1>HelpDesk</h1>
        <p>Sistema de Chamados</p>
      </div>
    </div>
  );
}
