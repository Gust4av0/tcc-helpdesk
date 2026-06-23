interface HistoricoIA {
  pergunta: string;
  resposta: string;
}

export const responderIAHelpDesk = async (
  pergunta: string,
  nomeUsuario?: string,
  historico: HistoricoIA[] = [],
) => {
  const primeiroNome = nomeUsuario?.split(" ")[0] || "Cliente";

  const historicoFormatado = historico
    .map(
      (item) => `
Usuário: ${item.pergunta}
IA: ${item.resposta}
`,
    )
    .join("\n");

  const contexto = `
Você é uma IA de suporte técnico de um sistema HelpDesk.

Você só pode responder assuntos relacionados a:
- suporte técnico
- abertura de chamados
- status de chamados
- login
- senha
- acesso ao sistema
- computador
- internet
- rede
- impressora
- erro em sistema
- atendimento técnico
- SLA
- mensagens do chamado

Regras:
- Sempre responda em português brasileiro.
- Não cumprimente com "Olá", "Oi", "Bom dia", "Boa tarde" ou "Boa noite".
- Não chame o usuário de "Cliente".
- Use o primeiro nome do usuário quando fizer sentido.
- Se usar o nome, comece assim: "${primeiroNome}, ..."
- Use o histórico da conversa para entender continuações como "ela", "isso", "já fiz", "não funcionou".
- Seja objetivo e dê passos práticos.
- Se não conseguir resolver, oriente o usuário a abrir um chamado.

Se a pergunta não for relacionada a HelpDesk ou suporte técnico, responda exatamente:
"Não posso responder sobre esse assunto. Posso ajudar apenas com dúvidas relacionadas ao suporte técnico e ao sistema HelpDesk."
`;

  const prompt = `
${contexto}

Primeiro nome do usuário: ${primeiroNome}

Histórico recente da conversa:
${historicoFormatado || "Sem histórico anterior."}

Nova pergunta do usuário:
${pergunta}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${
        process.env.GEMINI_MODEL || "gemini-2.5-flash"
      }:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.log("[GEMINI] Erro:", data);

      if (response.status === 429) {
        return `${primeiroNome}, o assistente de IA atingiu o limite temporário de uso. Mesmo assim, recomendo abrir um chamado com a descrição do problema para que um técnico possa analisar.`;
      }

      if (response.status === 503) {
        return `${primeiroNome}, o assistente de IA está temporariamente indisponível por alta demanda. Recomendo abrir um chamado para que o suporte técnico possa analisar o problema.`;
      }

      return `${primeiroNome}, não consegui consultar a IA agora. Recomendo abrir um chamado para que um técnico possa analisar seu problema.`;
    }

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      `${primeiroNome}, não consegui gerar uma resposta agora. Recomendo abrir um chamado para um técnico analisar seu problema.`
    );
  } catch (error) {
    console.log("[GEMINI] Erro inesperado:", error);

    return `${primeiroNome}, não consegui acessar o assistente de IA no momento. Recomendo abrir um chamado para que o suporte técnico possa analisar seu problema.`;
  }
};