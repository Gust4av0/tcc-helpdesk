import { X } from "lucide-react";
import { useState } from "react";
import "./open-ticket-modal.css";

interface OpenTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: {
    id: number;
    nome: string;
    sla_atendimento?: number;
    sla_resolucao?: number;
  }[];
  onSubmit?: (data: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => void;
}

const priorities = [
  {
    value: "Baixa",
    title: "Baixa",
    description: "Pode aguardar na fila",
  },
  {
    value: "Média",
    title: "Média",
    description: "Impacta parte do trabalho",
  },
  {
    value: "Alta",
    title: "Alta",
    description: "Afeta operação importante",
  },
  {
    value: "Urgente",
    title: "Urgente",
    description: "Paralisa o atendimento",
  },
];

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

  const selectedCategory = categories?.find(
    (category) => category.nome === formData.category,
  );

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
          <div>
            <span>Novo atendimento</span>
            <h2 data-testid="modal-title">Abrir Chamado</h2>
          </div>

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
                {categories?.map((categoria) => (
                  <option key={categoria.id} value={categoria.nome}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <small className="category-sla-preview">
                  Atendimento em até {selectedCategory.sla_atendimento ?? "-"}h
                  {" | "}
                  solução em até {selectedCategory.sla_resolucao ?? "-"}h
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="priority">Prioridade</label>
              <input
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                hidden
                data-testid="select-priority"
              />
              <div className="priority-options">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    className={`priority-option ${priority.value
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase()} ${
                      formData.priority === priority.value ? "selected" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: priority.value,
                      }))
                    }
                  >
                    <strong>{priority.title}</strong>
                    <span>{priority.description}</span>
                  </button>
                ))}
              </div>
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
