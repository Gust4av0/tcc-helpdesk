import { X } from "lucide-react";
import { useState } from "react";
import "./open-ticket-modal.css";

interface OpenTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: {
    id: number;
    nome: string;
  }[];
  onSubmit?: (data: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => void;
}

export function OpenTicketModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
}: OpenTicketModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div className="modal-container" data-testid="open-ticket-modal">
        <div className="modal-header">
          <h2 data-testid="modal-title">Abrir Chamado</h2>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
            data-testid="close-modal-btn"
          >
            <X />
          </button>
        </div>

        <div className="modal-body">
          <form
            className="modal-form"
            onSubmit={handleSubmit}
            data-testid="open-ticket-form"
          >
            <div className="form-field">
              <label htmlFor="title">Título</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Digite o título do chamado"
                required
                data-testid="input-title"
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva o problema..."
                required
                data-testid="input-description"
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                data-testid="select-category"
              >
                <option value="">Selecione uma categoria</option>
                {categories?.length &&
                  categories.map((categoria) => (
                    <option key={categoria.id} value={categoria.nome}>
                      {categoria.nome}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="priority">Prioridade</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="priority-select"
                required
                data-testid="select-priority"
              >
                <option value="">Selecione a prioridade</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={onClose}
                data-testid="cancel-button"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="modal-btn-submit"
                data-testid="submit-button"
              >
                Abrir Chamado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
