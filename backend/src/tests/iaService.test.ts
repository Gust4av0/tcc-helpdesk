import { responderIAHelpDesk } from "../service/iaService";

describe("Teste unitário do serviço de IA", () => {
    
  beforeEach(() => {
     jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar resposta da IA quando o Gemini responder com sucesso", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: "Anderson, reinicie o computador e tente acessar novamente.",
                },
              ],
            },
          },
        ],
      }),
    });

    global.fetch = mockFetch as any;

    const resposta = await responderIAHelpDesk(
      "Meu computador está travando",
      "Anderson",
    );

    expect(resposta).toContain("reinicie o computador");
    expect(mockFetch).toHaveBeenCalled();
  });

  it("deve retornar fallback quando o Gemini atingir limite de uso", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({
        error: {
          code: 429,
          message: "Quota exceeded",
        },
      }),
    });

    global.fetch = mockFetch as any;

    const resposta = await responderIAHelpDesk(
      "Meu sistema está fora do ar",
      "Anderson",
    );

    expect(resposta).toContain("Anderson");
    expect(resposta.toLowerCase()).toContain("chamado");
  });

  it("deve retornar fallback quando o Gemini estiver indisponível", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({
        error: {
          code: 503,
          message: "High demand",
        },
      }),
    });

    global.fetch = mockFetch as any;

    const resposta = await responderIAHelpDesk(
      "Não consigo acessar o sistema",
      "Anderson",
    );

    expect(resposta).toContain("Anderson");
    expect(resposta.toLowerCase()).toContain("chamado");
  });
});