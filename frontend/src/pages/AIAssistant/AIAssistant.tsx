import { useEffect, useRef, useState } from "react";
import { Bot, Send, User, ClipboardList, Trash2 } from "lucide-react";
import {
  enviarPerguntaIA,
  listarHistoricoIA,
  limparHistoricoIA,
} from "../../services/ia";
import { AuthUser } from "../../services/auth";
import "./ai-assistant.css";

interface AIAssistantProps {
  user: AuthUser | null;
  onOpenTicket?: (description: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant({ user, onOpenTicket }: AIAssistantProps) {
  const mensagemInicial: Message = {
    role: "assistant",
    content: `Olá, ${
      user?.nome || "cliente"
    }! Sou a IA de suporte do HelpDesk. Como posso ajudar?`,
  };

  const [messages, setMessages] = useState<Message[]>([mensagemInicial]);
  const [pergunta, setPergunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const historico = await listarHistoricoIA();

        if (historico.length === 0) {
          setMessages([mensagemInicial]);
          return;
        }

        const mensagensDoBanco: Message[] = historico.flatMap((item) => [
          {
            role: "user",
            content: item.pergunta,
          },
          {
            role: "assistant",
            content: item.resposta,
          },
        ]);

        setMessages([mensagemInicial, ...mensagensDoBanco]);
      } catch {
        setMessages([mensagemInicial]);
      } finally {
        setLoadingHistory(false);
      }
    };

    carregarHistorico();
  }, [user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, loadingHistory]);

  const normalizarTexto = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const mensagensIgnoradas = [
    "obrigado",
    "obrigada",
    "obg",
    "brigado",
    "brigada",
    "valeu",
    "vlw",
    "ok",
    "okay",
    "okk",
    "okey",
    "beleza",
    "blz",
    "show",
    "show de bola",
    "certo",
    "certinho",
    "ta bom",
    "tá bom",
    "ta certo",
    "tá certo",
    "entendi",
    "entendido",
    "sim",
    "nao",
    "não",
    "aham",
    "uhum",
    "isso",
    "isso mesmo",
    "perfeito",
    "top",
    "boa",
    "boaa",
    "deu certo",
    "deu bom",
    "funcionou",
    "resolvido",
    "resolvi",
    "consegui",
    "agradeço",
    "agradeco",
    "muito obrigado",
    "muito obrigada",
    "obrigado pela ajuda",
    "obrigada pela ajuda",
    "valeu pela ajuda",
    "era isso",
    "só isso",
    "so isso",
    "mais nada",
    "sem problemas",
    "tranquilo",
    "tranquila",
    "tudo certo",
    "tudo ok",
    "bom dia",
    "boa tarde",
    "boa noite",
    "oi",
    "olá",
    "ola",
    "eai",
    "e aí",
    "salve",
    "opa",
    "teste",
    "testando",
    "kkkk",
    "kkk",
    "haha",
    "hehe",
  ];

  const palavrasTecnicas = [
    "erro",
    "problema",
    "falha",
    "bug",
    "travando",
    "travou",
    "lento",
    "lentidao",
    "lentidão",
    "fora do ar",
    "nao abre",
    "não abre",
    "nao acessa",
    "não acessa",
    "nao consigo acessar",
    "não consigo acessar",
    "nao funciona",
    "não funciona",
    "nao funcionou",
    "não funcionou",
    "sistema",
    "login",
    "senha",
    "acesso",
    "usuario",
    "usuário",
    "internet",
    "rede",
    "wifi",
    "wi-fi",
    "computador",
    "notebook",
    "pc",
    "impressora",
    "servidor",
    "tela azul",
    "conexao",
    "conexão",
    "chamado",
    "atendimento",
    "aplicacao",
    "aplicação",
    "site",
    "pagina",
    "página",
    "carregar",
    "carrega",
    "email",
    "e-mail",
    "banco",
    "dados",
    "arquivo",
    "anexo",
    "instalar",
    "atualizar",
    "bloqueado",
    "parado",
    "parada",
    "urgente",
    "urgencia",
    "urgência",
  ];

  const mensagemPareceIrrelevante = (content: string) => {
    const textoNormalizado = normalizarTexto(content);

    if (!textoNormalizado) {
      return true;
    }

    if (mensagensIgnoradas.includes(textoNormalizado)) {
      return true;
    }

    if (textoNormalizado.length < 8) {
      return true;
    }

    const temPalavraTecnica = palavrasTecnicas.some((palavra) =>
      textoNormalizado.includes(normalizarTexto(palavra)),
    );

    const mensagemGrande = textoNormalizado.length >= 25;

    if (!temPalavraTecnica && !mensagemGrande) {
      return true;
    }

    return false;
  };

  const ultimaMensagemTecnicaParaChamado =
    [...messages]
      .reverse()
      .filter((message) => message.role === "user")
      .map((message) => message.content.trim())
      .find((content) => !mensagemPareceIrrelevante(content)) || "";

  const descricaoChamado =
    ultimaMensagemTecnicaParaChamado || "Problema relatado pelo usuário na IA";

  const handleOpenTicketClick = () => {
    onOpenTicket?.(descricaoChamado);
  };

  const handleAskClearHistory = () => {
    setShowClearConfirm(true);
  };

  const handleCancelClearHistory = () => {
    setShowClearConfirm(false);
  };

  const handleConfirmClearHistory = async () => {
    setClearingHistory(true);

    try {
      await limparHistoricoIA();
      setMessages([mensagemInicial]);
      setShowClearConfirm(false);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Não consegui limpar o histórico agora. Tente novamente em alguns instantes.",
        },
      ]);
    } finally {
      setClearingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!pergunta.trim() || loading) return;

    const textoPergunta = pergunta.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: textoPergunta,
      },
    ]);

    setPergunta("");
    setLoading(true);

    try {
      const result = await enviarPerguntaIA(textoPergunta);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.resposta,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Não consegui responder agora. Se o problema continuar, recomendo abrir um chamado para um técnico analisar.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-page">
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-header-icon">
            <Bot />
          </div>

          <div>
            <h1>IA Suporte</h1>
            <p>Assistente inteligente para dúvidas técnicas do HelpDesk</p>
          </div>
        </div>

        <button
          type="button"
          className="ai-clear-button"
          onClick={handleAskClearHistory}
          disabled={loading || loadingHistory || clearingHistory}
        >
          <Trash2 />
          {clearingHistory ? "Limpando..." : "Limpar conversa"}
        </button>
      </div>

      {showClearConfirm && (
        <div className="ai-confirm-box">
          <div>
            <strong>Limpar conversa?</strong>
            <p>
              Essa ação vai apagar todo o histórico da IA deste usuário.
            </p>
          </div>

          <div className="ai-confirm-actions">
            <button
              type="button"
              className="ai-confirm-cancel"
              onClick={handleCancelClearHistory}
              disabled={clearingHistory}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="ai-confirm-delete"
              onClick={handleConfirmClearHistory}
              disabled={clearingHistory}
            >
              {clearingHistory ? "Limpando..." : "Sim, limpar"}
            </button>
          </div>
        </div>
      )}

      <div className="ai-chat">
        {loadingHistory ? (
          <div className="ai-message assistant">
            <div className="ai-message-icon">
              <Bot />
            </div>

            <div className="ai-message-content">Carregando histórico...</div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`ai-message ${message.role}`}>
              <div className="ai-message-icon">
                {message.role === "assistant" ? <Bot /> : <User />}
              </div>

              <div className="ai-message-content">{message.content}</div>
            </div>
          ))
        )}

        {loading && (
          <div className="ai-message assistant">
            <div className="ai-message-icon">
              <Bot />
            </div>

            <div className="ai-message-content">Pensando...</div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {onOpenTicket && (
        <div className="ai-ticket-action">
          <button type="button" onClick={handleOpenTicketClick}>
            <ClipboardList />
            Abrir chamado com essa conversa
          </button>
        </div>
      )}

      <div className="ai-input-area">
        <textarea
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Digite seu problema técnico..."
          disabled={loading || loadingHistory}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={loading || loadingHistory}
        >
          <Send />
          Enviar
        </button>
      </div>
    </section>
  );
}