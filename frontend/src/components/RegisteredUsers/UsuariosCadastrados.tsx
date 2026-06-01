import { useState, useEffect } from "react";
import {
  User,
  Mail,
  MoreVertical,
  Edit2,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useToast } from "../Toast/ToastContext";
import { deleteUser, createUser, updateUser } from "../../services/user";
import "./usuarios-cadastrados.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
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
  const [formData, setFormData] = useState<UsuarioForm>({
    nome: "",
    email: "",
    senha: "",
    tipo: "CLIENTE",
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
    setFormData({
      nome: "",
      email: "",
      senha: "",
      tipo: "CLIENTE",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.tipo) {
      addToast("error", "Preencha todos os campos obrigatórios");
      return;
    }

    if (formMode === "create" && (!formData.email || !formData.senha)) {
      addToast("error", "E-mail e senha são obrigatórios para novo usuário");
      return;
    }

    setIsSaving(true);

    try {
      if (formMode === "create") {
        await createUser({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          tipo: formData.tipo,
        });
        addToast("success", "Usuário cadastrado com sucesso");
      } else if (selectedUser) {
        await updateUser(selectedUser.id, {
          nome: formData.nome,
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
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleFormChange}
                    required
                  />
                </label>
              )}
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
