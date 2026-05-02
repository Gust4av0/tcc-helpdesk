import { useState } from 'react';
import { X, Tag, FileText, Clock } from 'lucide-react';
import { useToast } from '../Toast/ToastContext';
import './cadastrar-categorias-modal.css';

interface CadastrarCategoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    nome: string;
    descricao: string;
    slaAtendimento: string;
    slaResolucao: string;
  }) => void;
}

export function CadastrarCategoriasModal({
  isOpen,
  onClose,
  onSubmit,
}: CadastrarCategoriasModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    slaAtendimento: '',
    slaResolucao: '',
  });

  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.descricao) {
      addToast('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    onSubmit?.(formData);

    addToast('success', 'Categoria cadastrada com sucesso!');

    setFormData({
      nome: '',
      descricao: '',
      slaAtendimento: '',
      slaResolucao: '',
    });

    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="categorias-modal-overlay" onClick={handleOverlayClick}>
      <div className="categorias-modal-container">
        <div className="categorias-modal-header">
          <h2>Cadastrar Categoria</h2>
          <button
            onClick={onClose}
            className="categorias-modal-close-btn"
            aria-label="Fechar"
          >
            <X />
          </button>
        </div>

        <div className="categorias-modal-body">
          <form onSubmit={handleSubmit} className="categorias-modal-form">
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
                />
              </div>
            </div>

            <div className="categorias-form-row">
              <div className="categorias-form-field">
                <label htmlFor="slaAtendimento">SLA de Atendimento (horas)</label>
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
                  />
                </div>
              </div>

              <div className="categorias-form-field">
                <label htmlFor="slaResolucao">SLA de Resolução (horas)</label>
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
                  />
                </div>
              </div>
            </div>

            <div className="categorias-modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="categorias-modal-btn-cancel"
              >
                Cancelar
              </button>
              <button type="submit" className="categorias-modal-btn-submit">
                Cadastrar Categoria
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}