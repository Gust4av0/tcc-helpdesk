import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useToast } from "../Toast/ToastContext";
import { PasswordVisibilityButton } from "../auth/PasswordVisibilityButton";
import { deleteUser, createUser, updateUser } from "../../services/user";
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
import "./usuarios-cadastrados.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  cpf_cnpj?: string;
  telefone?: string;
  data_nascimento?: string;
  cep?: string;
}

interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
  cpf_cnpj: string;
  telefone: string;
  data_nascimento: string;
  cep: string;
}

interface UsuariosCadastradosProps {
  isOpen: boolean;
  onClose: () => void;
  usuarios: Usuario[];
  onRefresh?: () => Promise<void>;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function isoToDateMask(value?: string) {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function UsuariosCadastrados({
  isOpen,
  onClose,
  usuarios,
  onRefresh,
}: UsuariosCadastradosProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UsuarioForm>({
    nome: "",
    email: "",
    senha: "",
    tipo: "CLIENTE",
    cpf_cnpj: "",
    telefone: "",
    data_nascimento: "",
    cep: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [activeDropdown]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowForm(false);
      resetForm();
      onClose();
    }
  };

  const getBadgeClass = (tipo: string) => {
    switch (tipo) {
      case "ADMIN":
        return "usuario-badge-admin";
      case "SUPORTE":
        return "usuario-badge-tecnico";
      case "CLIENTE":
        return "usuario-badge-cliente";
      default:
        return "";
    }
  };

  const toggleDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setShowPassword(false);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      tipo: "CLIENTE",
      cpf_cnpj: "",
      telefone: "",
      data_nascimento: "",
      cep: "",
    });
    setFormMode("create");
  };

  const handleCreateClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setFormMode("edit");
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      tipo: usuario.tipo,
      cpf_cnpj: usuario.cpf_cnpj ?? "",
      telefone: usuario.telefone ?? "",
      data_nascimento: isoToDateMask(usuario.data_nascimento),
      cep: usuario.cep ?? "",
    });
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleExcluir = async (usuarioId: number) => {
    try {
      await deleteUser(usuarioId);
      addToast("success", "Usuário excluído com sucesso");
      setActiveDropdown(null);
      await onRefresh?.();
    } catch (err: unknown) {
      addToast("error", getErrorMessage(err, "Erro ao excluir usuário"));
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const maskedValue =
      name === "cpf_cnpj"
        ? maskCpfCnpj(value)
        : name === "telefone"
          ? maskPhone(value)
          : name === "data_nascimento"
            ? maskDate(value)
            : name === "cep"
              ? maskCep(value)
              : value;

    setFormData((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlank(formData.nome) || isBlank(formData.tipo)) {
      addToast("error", "Preencha todos os campos obrigatórios");
      return;
    }

    if (
      formMode === "create" &&
      (isBlank(formData.email) ||
        isBlank(formData.senha) ||
        isBlank(formData.cpf_cnpj) ||
        isBlank(formData.telefone) ||
        isBlank(formData.data_nascimento) ||
        isBlank(formData.cep))
    ) {
      addToast("error", "Preencha todos os campos do novo usuário");
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      addToast("error", "Informe um e-mail válido");
      return;
    }

    if (formMode === "create" && formData.senha.length < 6) {
      addToast("error", "A senha precisa ter pelo menos 6 caracteres");
      return;
    }

    if (formMode === "create" && !isStrongPassword(formData.senha)) {
      addToast(
        "error",
        "A senha precisa ter 1 letra maiúscula e 1 caractere especial",
      );
      return;
    }

    if (formData.cpf_cnpj && !isValidCpfCnpj(formData.cpf_cnpj)) {
      addToast("error", "Informe um CPF ou CNPJ válido e existente");
      return;
    }

    if (formData.telefone && !isValidPhone(formData.telefone)) {
      addToast("error", "Informe um telefone válido com DDD");
      return;
    }

    if (formData.data_nascimento && !isValidDate(formData.data_nascimento)) {
      addToast("error", "Informe uma data válida no formato DD/MM/AAAA");
      return;
    }

    if (formData.cep && !isValidCep(formData.cep)) {
      addToast("error", "Informe um CEP válido");
      return;
    }

    const userPayload = {
      nome: formData.nome.trim(),
      cpf_cnpj: formData.cpf_cnpj,
      telefone: formData.telefone,
      data_nascimento: formData.data_nascimento
        ? dateMaskToIso(formData.data_nascimento)
        : "",
      cep: formData.cep,
    };

    setIsSaving(true);

    try {
      if (formMode === "create") {
        await createUser({
          ...userPayload,
          email: formData.email.trim(),
          senha: formData.senha,
          tipo: formData.tipo,
        });
        addToast("success", "Usuário cadastrado com sucesso");
      } else if (selectedUser) {
        await updateUser(selectedUser.id, {
          ...userPayload,
          tipo: formData.tipo,
        });
        addToast("success", "Usuário atualizado com sucesso");
      }

      setShowForm(false);
      resetForm();
      await onRefresh?.();
    } catch (err: unknown) {
      addToast("error", getErrorMessage(err, "Erro ao salvar usuário"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="usuarios-overlay" onClick={handleOverlayClick}>
      <div className="usuarios-container">
        <div className="usuarios-header">
          <h2>Usuários Cadastrados</h2>
          <button
            onClick={onClose}
            className="usuarios-close-btn"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="usuarios-body">
          <div className="usuarios-tools">
            <button
              type="button"
              className="usuarios-new-btn"
              onClick={handleCreateClick}
            >
              <PlusCircle />
              Cadastrar usuário
            </button>
          </div>

          {showForm && (
            <form className="usuarios-form" onSubmit={handleFormSubmit}>
              <h3>
                {formMode === "create" ? "Cadastrar Usuário" : "Editar Usuário"}
              </h3>
              <div className="usuarios-form-row">
                <label>
                  Nome
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleFormChange}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled={formMode === "edit"}
                    required
                  />
                  {formMode === "edit" && (
                    <small className="usuarios-field-hint">
                      E-mail imutável para preservar o login do usuário.
                    </small>
                  )}
                </label>
              </div>
              {formMode === "create" && (
                <label>
                  Senha
                  <div className="usuarios-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="senha"
                      value={formData.senha}
                      onChange={handleFormChange}
                      required
                    />
                    <PasswordVisibilityButton
                      className="usuarios-input-action"
                      isVisible={showPassword}
                      onToggle={() => setShowPassword((value) => !value)}
                    />
                  </div>
                </label>
              )}
              <div className="usuarios-form-row">
                <label>
                  CPF/CNPJ
                  <input
                    type="text"
                    name="cpf_cnpj"
                    value={formData.cpf_cnpj}
                    onChange={handleFormChange}
                    inputMode="numeric"
                    maxLength={18}
                    placeholder="000.000.000-00"
                    required={formMode === "create"}
                  />
                </label>
                <label>
                  Telefone
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleFormChange}
                    inputMode="numeric"
                    maxLength={15}
                    placeholder="(00) 00000-0000"
                    required={formMode === "create"}
                  />
                </label>
              </div>
              <div className="usuarios-form-row">
                <label>
                  Data
                  <input
                    type="text"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleFormChange}
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="DD/MM/AAAA"
                    required={formMode === "create"}
                  />
                </label>
                <label>
                  CEP
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleFormChange}
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="00000-000"
                    required={formMode === "create"}
                  />
                </label>
              </div>
              <label>
                Tipo
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleFormChange}
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="SUPORTE">SUPORTE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>
              <div className="usuarios-form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {formMode === "create" ? "Cadastrar" : "Salvar"}
                </button>
              </div>
            </form>
          )}

          <div className="usuarios-list">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="usuario-card">
                <div className="usuario-avatar">
                  <User />
                </div>
                <div className="usuario-info">
                  <div className="usuario-id">ID: {usuario.id}</div>
                  <h3>{usuario.nome}</h3>
                  <div className="usuario-email">
                    <Mail />
                    <span>{usuario.email}</span>
                  </div>
                  {(usuario.telefone || usuario.cep) && (
                    <div className="usuario-extra">
                      {usuario.telefone && (
                        <span>
                          <Phone />
                          {usuario.telefone}
                        </span>
                      )}
                      {usuario.cep && (
                        <span>
                          <MapPin />
                          {usuario.cep}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className={`usuario-badge ${getBadgeClass(usuario.tipo)}`}>
                  {usuario.tipo}
                </div>
                <div className="usuario-actions">
                  <button
                    className="usuario-menu-btn"
                    onClick={(e) => toggleDropdown(e, usuario.id)}
                    aria-label="Opções"
                  >
                    <MoreVertical />
                  </button>
                  {activeDropdown === usuario.id && (
                    <div className="usuario-dropdown">
                      <button
                        className="usuario-dropdown-item"
                        onClick={() => handleEditClick(usuario)}
                      >
                        <Edit2 />
                        <span>Editar usuário</span>
                      </button>
                      <button
                        className="usuario-dropdown-item usuario-dropdown-item-delete"
                        onClick={() => handleExcluir(usuario.id)}
                      >
                        <Trash2 />
                        <span>Excluir usuário</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
