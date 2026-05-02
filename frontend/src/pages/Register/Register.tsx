import { User, Mail, CreditCard, Lock } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthHeader } from '../../components/auth/AuthHeader';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import '../../components/auth/authform.css';

interface RegisterProps {
  onNavigateToLogin?: () => void;
  onSubmit?: (data: {
    name: string;
    email: string;
    cpfCnpj: string;
    password: string;
  }) => void;
}

export default function Register({ onNavigateToLogin, onSubmit }: RegisterProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      cpfCnpj: formData.get('cpfCnpj') as string,
      password: formData.get('password') as string,
    };

    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log('Register:', data);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader />

      <div className="auth-form-wrapper">
        <div className="auth-title">
          <h2>Criar conta</h2>
          <p>Preencha os dados para se cadastrar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthInput
            label="Nome completo"
            type="text"
            name="name"
            placeholder="João Silva"
            icon={User}
          />

          <AuthInput
            label="Email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            icon={Mail}
          />

          <AuthInput
            label="CPF/CNPJ"
            type="text"
            name="cpfCnpj"
            placeholder="000.000.000-00"
            icon={CreditCard}
          />

          <AuthInput
            label="Senha"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={Lock}
          />

          <AuthButton type="submit">
            Cadastrar
          </AuthButton>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{' '}
            <button
              type="button"
              className="auth-link"
              onClick={onNavigateToLogin}
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
