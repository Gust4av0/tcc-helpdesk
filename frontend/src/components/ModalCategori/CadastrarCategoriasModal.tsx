import { useState } from "react";
import { X, Tag, FileText, Clock, Trash2, Edit3 } from "lucide-react";
import { useToast } from "../Toast/ToastContext";
import { Categoria } from "../../services/category";
import "./cadastrar-categorias-modal.css";

interface CadastrarCategoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    nome: string;
    descricao: string;
    slaAtendimento: string;
    slaResolucao: string;
  }) => Promise<void>;
  onUpdateCategory?: (
    id: number,
    data: {
      nome: string;
      descricao: string;
      slaAtendimento: string;
      slaResolucao: string;
    },
  ) => Promise<void>;
  categories?: Categoria[];
  onDeleteCategory?: (id: number) => Promise<void>;
}

export function CadastrarCategoriasModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdateCategory,
  categories,
  onDeleteCategory,
}: CadastrarCategoriasModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    slaAtendimento: "",
    slaResolucao: "",
  });

  const [editingCategory, setEditingCategory] = useState<Categoria | null>(
    null,
  );

  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.descricao) {
      addToast("error", "Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingCategory && onUpdateCategory) {
        await onUpdateCategory(editingCategory.id, formData);
        addToast("success", "Categoria atualizada com sucesso!");
      } else {
        await onSubmit?.(formData);
      }

      setFormData({
        nome: "",
        descricao: "",
        slaAtendimento: "",
        slaResolucao: "",
      });

      setEditingCategory(null);
      onClose();
    } catch {
      // Toast tratado pelo componente pai
    }
  };

  const handleDeleteCategory = async (id: number) => {
    await onDeleteCategory?.(id);
  };

  const handleEditCategory = (categoria: Categoria) => {
    setEditingCategory(categoria);

    setFormData({
      nome: categoria.nome,
      descricao: categoria.descricao,
      slaAtendimento: String(categoria.sla_atendimento),
      slaResolucao: String(categoria.sla_resolucao),
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setEditingCategory(null);

      setFormData({
        nome: "",
        descricao: "",
        slaAtendimento: "",
        slaResolucao: "",
      });

      onClose();
    }
  };

  return (
    <div
      className="categorias-modal-overlay"
      onClick={handleOverlayClick}
      data-testid="category-overlay"
    >
      <div
        className="categorias-modal-container"
        data-testid="category-modal"
      >
        <div className="categorias-modal-header">
          <h2>Cadastrar Categoria</h2>

          <button
            onClick={onClose}
            className="categorias-modal-close-btn"
            aria-label="Fechar"
            data-testid="categoria-close"
          >
            <X />
          </button>
        </div>

        <div className="categorias-modal-body">
          <form
            onSubmit={handleSubmit}
            className="categorias-modal-form"
          >
            <div className="categorias-form-field">
              <label htmlFor="nome">Nome da Categoria</label>

              <div className="categorias-input-wrapper">
                <Tag className="categorias-input-icon" />

                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Ex: Hardware, Software, Rede"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  data-testid="categoria-nome"
                />
              </div>
            </div>

            <div className="categorias-form-field">
              <label htmlFor="descricao">Descrição</label>

              <div className="categorias-input-wrapper">
                <FileText className="categorias-input-icon" />

                <textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva a categoria..."
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  data-testid="categoria-descricao"
                />
              </div>
            </div>

            <div className="categorias-form-row">
              <div className="categorias-form-field">
                <label htmlFor="slaAtendimento">
                  SLA de Atendimento (horas)
                </label>

                <div className="categorias-input-wrapper">
                  <Clock className="categorias-input-icon" />

                  <input
                    type="number"
                    id="slaAtendimento"
                    name="slaAtendimento"
                    placeholder="Ex: 2"
                    min="1"
                    value={formData.slaAtendimento}
                    onChange={handleChange}
                    required
                    data-testid="categoria-sla-atendimento"
                  />
                </div>
              </div>

              <div className="categorias-form-field">
                <label htmlFor="slaResolucao">
                  SLA de Resolução (horas)
                </label>

                <div className="categorias-input-wrapper">
                  <Clock className="categorias-input-icon" />

                  <input
                    type="number"
                    id="slaResolucao"
                    name="slaResolucao"
                    placeholder="Ex: 24"
                    min="1"
                    value={formData.slaResolucao}
                    onChange={handleChange}
                    required
                    data-testid="categoria-sla-resolucao"
                  />
                </div>
              </div>
            </div>

            <div className="categorias-modal-footer">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);

                  setFormData({
                    nome: "",
                    descricao: "",
                    slaAtendimento: "",
                    slaResolucao: "",
                  });

                  onClose();
                }}
                className="categorias-modal-btn-cancel"
                data-testid="categoria-cancel"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="categorias-modal-btn-submit"
                data-testid="categoria-submit"
              >
                {editingCategory
                  ? "Atualizar Categoria"
                  : "Cadastrar Categoria"}
              </button>
            </div>
          </form>

          {categories && categories.length > 0 && (
            <div className="categorias-existing-list">
              <h3>Categorias cadastradas</h3>

              <div className="categorias-list">
                {categories.map((categoria) => (
                  <div
                    key={categoria.id}
                    className="categorias-item"
                  >
                    <div className="categorias-item-info">
                      <strong>{categoria.nome}</strong>

                      <p>{categoria.descricao}</p>

                      <div className="categorias-item-sla">
                        <span>
                          SLA atendimento: {categoria.sla_atendimento}h
                        </span>

                        <span>
                          SLA resolução: {categoria.sla_resolucao}h
                        </span>
                      </div>
                    </div>

                    <div className="categorias-item-actions">
                      <button
                        type="button"
                        className="categorias-item-edit"
                        onClick={() => handleEditCategory(categoria)}
                        data-testid={`editar-categoria-${categoria.id}`}
                      >
                        <Edit3 /> Editar
                      </button>

                      <button
                        type="button"
                        className="categorias-item-delete"
                        onClick={() =>
                          handleDeleteCategory(categoria.id)
                        }
                        data-testid={`excluir-categoria-${categoria.id}`}
                      >
                        <Trash2 /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}