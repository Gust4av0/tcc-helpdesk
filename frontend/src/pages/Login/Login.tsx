import { ArrowRight, Mail, Lock } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthInput } from "../../components/auth/AuthInput";
import { AuthButton } from "../../components/auth/AuthButton";
import "../../components/auth/authform.css";

interface LoginProps {
  onNavigateToRegister?: () => void;
  onSubmit?: (email: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function Login({
  onNavigateToRegister,
  onSubmit,
  loading = false,
  error,
}: LoginProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (onSubmit) {
      onSubmit(email, password);
    } else {
      console.log("Login:", { email, password });
    }
  };

  return (
    <AuthLayout>
      <AuthHeader />

      <div className="auth-form-wrapper">
        <div className="auth-title">
          <span>Acesso seguro</span>
          <h2>Entrar no sistema</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            icon={Mail}
            autoComplete="email"
            inputMode="email"
            data-testid="input-email"
          />

          <AuthInput
            label="Senha"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={Lock}
            autoComplete="current-password"
            data-testid="input-password"
          />

          <AuthButton
            type="submit"
            disabled={loading}
            data-testid="login-submit-button"
          >
            {loading ? (
              "Acessando..."
            ) : (
              <>
                Entrar
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </AuthButton>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={onNavigateToRegister}
              data-testid="go-to-register"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
