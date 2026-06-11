import { useEffect, useState } from "react";
import { Lock, Mail, Save, User, X } from "lucide-react";
import { AuthUser } from "../../services/auth";
import { updateProfile } from "../../services/user";
import { useToast } from "../Toast/ToastContext";
import { PasswordVisibilityButton } from "../auth/PasswordVisibilityButton";
import "./profile-modal.css";

interface ProfileModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  onClose: () => void;
  onProfileUpdated: (user: AuthUser) => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function ProfileModal({
  isOpen,
  user,
  onClose,
  onProfileUpdated,
}: ProfileModalProps) {
  const { addToast } = useToast();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setNome(user.nome);
      setSenha("");
      setConfirmarSenha("");
      setShowSenha(false);
      setShowConfirmarSenha(false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nome.trim()) {
      addToast("error", "Informe seu nome.");
      return;
    }

    if (senha && senha.length < 6) {
      addToast("error", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha && senha !== confirmarSenha) {
      addToast("error", "As senhas não conferem.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await updateProfile({
        nome: nome.trim(),
        ...(senha ? { senha } : {}),
      });

      onProfileUpdated(updatedUser as AuthUser);
      addToast("success", "Perfil atualizado com sucesso!");
      onClose();
    } catch (err: unknown) {
      addToast("error", getErrorMessage(err, "Erro ao atualizar perfil."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="profile-overlay" onClick={handleOverlayClick}>
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <span className="profile-eyebrow">Minha conta</span>
            <h2>Editar perfil</h2>
            <p>Atualize seu nome e senha. Seu e-mail permanece imutável.</p>
          </div>
          <button type="button" className="profile-close" onClick={onClose}>
            <X />
          </button>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label className="profile-field">
            Nome
            <div className="profile-input-wrapper">
              <User />
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>
          </label>

          <label className="profile-field">
            E-mail
            <div className="profile-input-wrapper profile-input-disabled">
              <Mail />
              <input type="email" value={user.email} disabled />
            </div>
            <small>O e-mail é usado no login e não pode ser alterado.</small>
          </label>

          <div className="profile-password-grid">
            <label className="profile-field">
              Nova senha
              <div className="profile-input-wrapper">
                <Lock />
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Deixe em branco para manter"
                />
                <PasswordVisibilityButton
                  className="profile-input-action"
                  isVisible={showSenha}
                  onToggle={() => setShowSenha((value) => !value)}
                />
              </div>
            </label>

            <label className="profile-field">
              Confirmar senha
              <div className="profile-input-wrapper">
                <Lock />
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  placeholder="Repita a nova senha"
                />
                <PasswordVisibilityButton
                  className="profile-input-action"
                  isVisible={showConfirmarSenha}
                  onToggle={() => setShowConfirmarSenha((value) => !value)}
                />
              </div>
            </label>
          </div>

          <div className="profile-actions">
            <button type="button" className="profile-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="profile-save" disabled={isSaving}>
              <Save />
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
