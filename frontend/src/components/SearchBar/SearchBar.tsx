import { useState, useRef, useEffect } from 'react';
import { Search, Ticket, User, Building2 } from 'lucide-react';
import './search-bar.css';

interface SearchResult {
  id: string;
  type: 'chamado' | 'cliente' | 'tecnico';
  title: string;
  subtitle: string;
}

const mockData: SearchResult[] = [
  // Chamados
  { id: '#2847', type: 'chamado', title: 'Computador não liga', subtitle: '#2847 • Tech Solutions Ltda' },
  { id: '#2846', type: 'chamado', title: 'Sistema travando constantemente', subtitle: '#2846 • Inovação Corp' },
  { id: '#2845', type: 'chamado', title: 'Lentidão na rede', subtitle: '#2845 • Digital Commerce SA' },
  { id: '#2844', type: 'chamado', title: 'E-mail não está enviando', subtitle: '#2844 • Consultoria Plus' },
  { id: '#2843', type: 'chamado', title: 'Instalação de software', subtitle: '#2843 • Start Business' },

  // Clientes
  { id: 'c1', type: 'cliente', title: 'Tech Solutions Ltda', subtitle: 'contato@techsolutions.com' },
  { id: 'c2', type: 'cliente', title: 'Inovação Corp', subtitle: 'atendimento@inovacaocorp.com' },
  { id: 'c3', type: 'cliente', title: 'Digital Commerce SA', subtitle: 'suporte@digitalcommerce.com' },
  { id: 'c4', type: 'cliente', title: 'Consultoria Plus', subtitle: 'contato@consultoriaplus.com' },
  { id: 'c5', type: 'cliente', title: 'Start Business', subtitle: 'info@startbusiness.com' },

  // Técnicos
  { id: 't1', type: 'tecnico', title: 'Carlos Mendes', subtitle: 'carlos.mendes@helpdesk.com' },
  { id: 't2', type: 'tecnico', title: 'Ana Paula Silva', subtitle: 'ana.paula@helpdesk.com' },
  { id: 't3', type: 'tecnico', title: 'Roberto Lima', subtitle: 'roberto.lima@helpdesk.com' },
  { id: 't4', type: 'tecnico', title: 'Juliana Santos', subtitle: 'juliana.santos@helpdesk.com' },
  { id: 't5', type: 'tecnico', title: 'Fernando Costa', subtitle: 'fernando.costa@helpdesk.com' },
];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = mockData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Clicou em:', result);
    setQuery('');
    setIsOpen(false);
  };

  const groupedResults = {
    chamados: results.filter(r => r.type === 'chamado').slice(0, 5),
    clientes: results.filter(r => r.type === 'cliente').slice(0, 5),
    tecnicos: results.filter(r => r.type === 'tecnico').slice(0, 5),
  };

  const typeLabels = {
    chamado: 'Chamado',
    cliente: 'Cliente',
    tecnico: 'Técnico',
  };

  const typeIcons = {
    chamado: Ticket,
    cliente: Building2,
    tecnico: User,
  };

  return (
    <div className="search-bar-wrapper" ref={searchRef}>
      <div className="search-bar-container">
        <Search className="search-bar-icon" />
        <input
          type="text"
          placeholder="Buscar chamados, clientes ou técnicos..."
          className="search-bar-input"
          value={query}
          onChange={handleInputChange}
        />
      </div>

      {isOpen && (
        <div className="search-dropdown">
          {results.length === 0 ? (
            <div className="search-empty">
              <Search className="search-empty-icon" />
              <p>Nenhum resultado encontrado</p>
            </div>
          ) : (
            <div className="search-results">
              {groupedResults.chamados.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Chamados</div>
                  {groupedResults.chamados.map(result => {
                    const Icon = typeIcons[result.type];
                    return (
                      <div
                        key={result.id}
                        className="search-result-item"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="search-result-icon chamado">
                          <Icon />
                        </div>
                        <div className="search-result-content">
                          <div className="search-result-title">{result.title}</div>
                          <div className="search-result-subtitle">{result.subtitle}</div>
                        </div>
                        <span className="search-result-badge chamado">
                          {typeLabels[result.type]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {groupedResults.clientes.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Clientes</div>
                  {groupedResults.clientes.map(result => {
                    const Icon = typeIcons[result.type];
                    return (
                      <div
                        key={result.id}
                        className="search-result-item"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="search-result-icon cliente">
                          <Icon />
                        </div>
                        <div className="search-result-content">
                          <div className="search-result-title">{result.title}</div>
                          <div className="search-result-subtitle">{result.subtitle}</div>
                        </div>
                        <span className="search-result-badge cliente">
                          {typeLabels[result.type]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {groupedResults.tecnicos.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Técnicos</div>
                  {groupedResults.tecnicos.map(result => {
                    const Icon = typeIcons[result.type];
                    return (
                      <div
                        key={result.id}
                        className="search-result-item"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="search-result-icon tecnico">
                          <Icon />
                        </div>
                        <div className="search-result-content">
                          <div className="search-result-title">{result.title}</div>
                          <div className="search-result-subtitle">{result.subtitle}</div>
                        </div>
                        <span className="search-result-badge tecnico">
                          {typeLabels[result.type]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
