import { useState } from "react";
import {
  ArrowRight,
  User,
  Mail,
  CreditCard,
  Lock,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthInput } from "../../components/auth/AuthInput";
import { AuthButton } from "../../components/auth/AuthButton";
import { PasswordVisibilityButton } from "../../components/auth/PasswordVisibilityButton";
import {
  dateMaskToIso,
  isBlank,
  isValidCep,
  isValidCpfCnpj,
  isValidDate,
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  maskCep,
  maskCpfCnpj,
  maskDate,
  maskPhone,
} from "../../utils/fieldValidation";
import "../../components/auth/authform.css";

interface RegisterProps {
  onNavigateToLogin?: () => void;
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
    cpfCnpj: string;
    telefone: string;
    dataNascimento: string;
    cep: string;
  }) => void;
  loading?: boolean;
  error?: string | null;
}

export default function Register({
  onNavigateToLogin,
  onSubmit,
  loading = false,
  error,
}: RegisterProps) {
  const [formValues, setFormValues] = useState({
    cpfCnpj: "",
    telefone: "",
    dataNascimento: "",
    cep: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const cpfCnpj = formValues.cpfCnpj.trim();
    const telefone = formValues.telefone.trim();
    const dataNascimento = formValues.dataNascimento.trim();
    const cep = formValues.cep.trim();

    if (
      isBlank(name) ||
      isBlank(email) ||
      isBlank(password) ||
      isBlank(confirmPassword) ||
      isBlank(cpfCnpj) ||
      isBlank(telefone) ||
      isBlank(dataNascimento) ||
      isBlank(cep)
    ) {
      setValidationError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError("Informe um e-mail válido.");
      return;
    }

    if (password.length < 6) {
      setValidationError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (!isStrongPassword(password)) {
      setValidationError(
        "A senha precisa ter 1 letra maiúscula e 1 caractere especial.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("As senhas nÃ£o conferem.");
      return;
    }

    if (cpfCnpj && !isValidCpfCnpj(cpfCnpj)) {
      setValidationError("Informe um CPF ou CNPJ válido e existente.");
      return;
    }

    if (telefone && !isValidPhone(telefone)) {
      setValidationError("Informe um telefone válido com DDD.");
      return;
    }

    if (dataNascimento && !isValidDate(dataNascimento)) {
      setValidationError("Informe uma data válida no formato DD/MM/AAAA.");
      return;
    }

    if (cep && !isValidCep(cep)) {
      setValidationError("Informe um CEP válido.");
      return;
    }

    const data = {
      name,
      email,
      password,
      cpfCnpj,
      telefone,
      dataNascimento: dataNascimento ? dateMaskToIso(dataNascimento) : "",
      cep,
    };

    setValidationError(null);

    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Register:", data);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader compact />

      <div className="auth-form-wrapper auth-register-wrapper">
        <div className="auth-title">
          <span>Novo usuário</span>
          <h2>Criar conta</h2>
          <p>Preencha os dados para se cadastrar</p>
        </div>

        {(error || validationError) && (
          <p className="auth-error">{validationError ?? error}</p>
        )}

        <form className="auth-form auth-register-form" onSubmit={handleSubmit}>
          <AuthInput
            label="Nome completo"
            type="text"
            name="name"
            placeholder="João Silva"
            icon={User}
            autoComplete="name"
          />

          <AuthInput
            label="Email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            icon={Mail}
            autoComplete="email"
            inputMode="email"
          />

          <AuthInput
            label="CPF ou CNPJ"
            type="text"
            name="cpfCnpj"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            icon={CreditCard}
            inputMode="numeric"
            value={formValues.cpfCnpj}
            maxLength={18}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                cpfCnpj: maskCpfCnpj(event.target.value),
              }))
            }
          />

          <AuthInput
            label="Telefone(Whatsapp)"
            type="text"
            name="telefone"
            placeholder="(00) 00000-0000"
            icon={Phone}
            inputMode="numeric"
            value={formValues.telefone}
            maxLength={15}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                telefone: maskPhone(event.target.value),
              }))
            }
          />

          <AuthInput
            label="Data de nascimento"
            type="text"
            name="dataNascimento"
            placeholder="DD/MM/AAAA"
            icon={Calendar}
            inputMode="numeric"
            value={formValues.dataNascimento}
            maxLength={10}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                dataNascimento: maskDate(event.target.value),
              }))
            }
          />

          <AuthInput
            label="CEP"
            type="text"
            name="cep"
            placeholder="00000-000"
            icon={MapPin}
            inputMode="numeric"
            value={formValues.cep}
            maxLength={9}
            onChange={(event) =>
              setFormValues((prev) => ({
                ...prev,
                cep: maskCep(event.target.value),
              }))
            }
          />

          <AuthInput
            label="Senha"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            icon={Lock}
            autoComplete="new-password"
            minLength={6}
            endAdornment={
              <PasswordVisibilityButton
                isVisible={showPassword}
                onToggle={() => setShowPassword((value) => !value)}
              />
            }
          />

          <AuthInput
            label="Confirmar senha"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Repita a senha"
            icon={Lock}
            autoComplete="new-password"
            minLength={6}
            endAdornment={
              <PasswordVisibilityButton
                isVisible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((value) => !value)}
              />
            }
          />

          <AuthButton type="submit" disabled={loading}>
            {loading ? (
              "Cadastrando..."
            ) : (
              <>
                Cadastrar
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </AuthButton>
        </form>

        <div className="auth-footer">
          <p>
            Já tem uma conta?{" "}
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
