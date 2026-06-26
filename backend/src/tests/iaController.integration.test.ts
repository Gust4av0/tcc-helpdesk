import {
  responderSuporteIA,
  listarHistoricoIA,
  limparHistoricoIA,
} from "../controllers/iaController";
import Usuario from "../models/Usuario";
import IaMensagem from "../models/IaMensagem";
import { responderIAHelpDesk } from "../service/iaService";

jest.mock("../models/Usuario", () => ({
  __esModule: true,
  default: {
    findByPk: jest.fn(),
  },
}));

jest.mock("../models/IaMensagem", () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock("../service/iaService", () => ({
  responderIAHelpDesk: jest.fn(),
}));

function mockResponse() {
  const res: any = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("Teste de integração do controller de IA", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve responder uma pergunta válida e salvar no histórico", async () => {
    const req: any = {
      body: {
        pergunta: "Não consigo acessar o sistema",
      },
      usuario: {
        id: 1,
      },
    };

    const res = mockResponse();

    (Usuario as any).findByPk.mockResolvedValue({
      getDataValue: (campo: string) => {
        if (campo === "nome") return "Anderson Cirino";
        return null;
      },
    });

    (IaMensagem as any).findAll.mockResolvedValue([]);

    (responderIAHelpDesk as jest.Mock).mockResolvedValue(
      "Anderson, tente redefinir sua senha. Se não resolver, abra um chamado.",
    );

    await responderSuporteIA(req, res);

    expect(responderIAHelpDesk).toHaveBeenCalledWith(
      "Não consigo acessar o sistema",
      "Anderson",
      [],
    );

    expect((IaMensagem as any).create).toHaveBeenCalledWith({
      usuario_id: 1,
      pergunta: "Não consigo acessar o sistema",
      resposta:
        "Anderson, tente redefinir sua senha. Se não resolver, abra um chamado.",
    });

    expect(res.json).toHaveBeenCalledWith({
      resposta:
        "Anderson, tente redefinir sua senha. Se não resolver, abra um chamado.",
    });
  });

  it("deve retornar erro 400 quando a pergunta estiver vazia", async () => {
    const req: any = {
      body: {
        pergunta: "",
      },
      usuario: {
        id: 1,
      },
    };

    const res = mockResponse();

    await responderSuporteIA(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Digite uma pergunta válida",
    });
  });

  it("deve listar o histórico da IA do usuário logado", async () => {
    const req: any = {
      usuario: {
        id: 1,
      },
    };

    const res = mockResponse();

    const historicoMock = [
      {
        id: 1,
        usuario_id: 1,
        pergunta: "Meu notebook não desliga",
        resposta: "Recomendo verificar processos abertos.",
      },
    ];

    (IaMensagem as any).findAll.mockResolvedValue(historicoMock);

    await listarHistoricoIA(req, res);

    expect((IaMensagem as any).findAll).toHaveBeenCalledWith({
      where: {
        usuario_id: 1,
      },
      order: [["id", "ASC"]],
    });

    expect(res.json).toHaveBeenCalledWith(historicoMock);
  });

  it("deve limpar o histórico da IA do usuário logado", async () => {
    const req: any = {
      usuario: {
        id: 1,
      },
    };

    const res = mockResponse();

    (IaMensagem as any).destroy.mockResolvedValue(1);

    await limparHistoricoIA(req, res);

    expect((IaMensagem as any).destroy).toHaveBeenCalledWith({
      where: {
        usuario_id: 1,
      },
    });

    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Histórico da IA limpo com sucesso",
    });
  });
});