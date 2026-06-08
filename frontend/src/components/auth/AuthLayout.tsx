import type { ReactNode } from "react";
import { CheckCircle, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import "./authlayout.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-container">
      <main className="auth-shell">
        <section className="auth-brand-panel" aria-label="Resumo do HelpDesk">
          <span className="auth-kicker">Gestão de suporte técnico</span>
          <h1>HelpDesk</h1>
          <p>
            Controle chamados, SLAs, técnicos e conversas em uma experiência
            organizada para operação diária.
          </p>

          <div className="auth-preview-grid" aria-hidden="true">
            <div className="auth-preview-card strong">
              <CheckCircle />
              <strong>32</strong>
              <span>Ativos</span>
            </div>

            <div className="auth-preview-card warning">
              <Clock />
              <strong>6</strong>
              <span>SLA 24h</span>
            </div>

            <div className="auth-preview-ticket">
              <span>Chamado #128</span>
              <strong>Falha de acesso ao sistema</strong>
              <div />
            </div>
          </div>

          <div className="auth-feature-strip" aria-hidden="true">
            <div>
              <ShieldCheck />
              <span>Controle</span>
            </div>
            <div>
              <MessageSquare />
              <span>Comunicação</span>
            </div>
          </div>
        </section>

        <section className="auth-card" aria-label="Formulário de autenticação">
          {children}
        </section>
      </main>
    </div>
  );
}
