import "./authheader.css";

export function AuthHeader() {
  return (
    <div className="auth-header">
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
