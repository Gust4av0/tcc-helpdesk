import { Mail, Lock } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import '../../components/auth/authform.css';

interface LoginProps {
  onNavigateToRegister?: () => void;
  onNavigateToDashboard?: () => void;
  onSubmit?: (email: string, password: string) => void;
}

export default function Login({
  onNavigateToRegister,
  onNavigateToDashboard,
  onSubmit,
}: LoginProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (onSubmit) {
      onSubmit(email, password);
    } else {
      console.log('Login:', { email, password });
    }

    
    onNavigateToDashboard?.();
  };

  return (
    <AuthLayout>
      <AuthHeader />

      <div className="auth-form-wrapper">
        <div className="auth-title">
          <h2>Entrar no sistema</h2>
          <p>Acesse sua conta para continuar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            label="Email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            icon={Mail}
            data-testid="input-email"
          />

          <AuthInput
            label="Senha"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={Lock}
            data-testid="input-password"
          />

          <AuthButton type="submit" data-testid="login-submit-button">
            Entrar
          </AuthButton>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta?{' '}
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