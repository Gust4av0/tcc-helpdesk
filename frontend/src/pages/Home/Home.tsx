import "../../styles/Home.css";
import {
  CheckCircle,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react";

export default function Home({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-hero">
          <h1 className="landing-title">HelpDesk</h1>
          <p className="landing-subtitle">
            Sistema de gerenciamento de chamados técnicos
          </p>

          <p className="landing-description">
            O HelpDesk é uma plataforma desenvolvida para
            facilitar a gestão de chamados técnicos entre
            clientes e equipes de suporte. O sistema permite que
            clientes abram chamados, acompanhem o andamento, e
            se comuniquem diretamente com técnicos responsáveis.
            Já os técnicos podem gerenciar atendimentos,
            atualizar status e garantir o cumprimento de SLAs. O
            objetivo é organizar o fluxo de suporte, melhorar a
            comunicação e aumentar a eficiência no atendimento.
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

        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon feature-icon-purple">
              <CheckCircle size={28} />
            </div>
            <h3 className="feature-title">Organização</h3>
            <p className="feature-description">
              Gerencie todos os chamados em um único lugar
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-blue">
              <Zap size={28} />
            </div>
            <h3 className="feature-title">Rapidez</h3>
            <p className="feature-description">
              Atendimento ágil com controle de SLA
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon feature-icon-gradient">
              <Users size={28} />
            </div>
            <h3 className="feature-title">Comunicação</h3>
            <p className="feature-description">
              Interação direta entre clientes e técnicos
            </p>
          </div>
        </div>
      </div>

      <div className="landing-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>
    </div>
  );
}