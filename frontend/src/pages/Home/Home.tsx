import "../../styles/Home.css";
import { ArrowRight, CheckCircle, Clock, MessageSquare, ShieldCheck } from "lucide-react";

export default function Home({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="landing-container">
      <main className="landing-content">
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="landing-kicker">Gestão de suporte técnico</span>
            <h1 className="landing-title">HelpDesk</h1>
            <p className="landing-subtitle">
              Controle chamados, SLAs, técnicos e conversas em uma experiência
              organizada para operação diária.
            </p>

            <div className="landing-buttons">
              <button
                data-testid="home-login-button"
                className="btn-primary"
                onClick={() => onNavigate("login")}
              >
                Entrar
                <ArrowRight size={20} />
              </button>

              <button
                data-testid="home-register-button"
                className="btn-secondary"
                onClick={() => onNavigate("register")}
              >
                Cadastre-se
              </button>
            </div>
          </div>

          <div className="landing-preview" aria-hidden="true">
            <div className="preview-topbar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-grid">
              <div className="preview-card strong">
                <CheckCircle />
                <strong>32</strong>
                <span>Ativos</span>
              </div>
              <div className="preview-card warning">
                <Clock />
                <strong>6</strong>
                <span>SLA 24h</span>
              </div>
              <div className="preview-ticket">
                <span>Chamado #128</span>
                <strong>Falha de acesso ao sistema</strong>
                <div />
              </div>
              <div className="preview-ticket">
                <span>Chamado #129</span>
                <strong>Impressora sem conexão</strong>
                <div />
              </div>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="feature-card">
            <ShieldCheck />
            <div>
              <h3>Controle</h3>
              <p>Permissões por perfil e fluxo claro de atendimento.</p>
            </div>
          </div>
          <div className="feature-card">
            <Clock />
            <div>
              <h3>SLA visível</h3>
              <p>Prazos aparecem no centro da decisão operacional.</p>
            </div>
          </div>
          <div className="feature-card">
            <MessageSquare />
            <div>
              <h3>Comunicação</h3>
              <p>Cliente e suporte conversam dentro do chamado.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
