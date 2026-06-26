import {
  criarMensagem,
  listarMensagens,
  listarResumoMensagens,
} from "../controllers/chamadoMensagemController";
import Chamado from "../models/Chamado";
import ChamadoMensagem from "../models/ChamadoMensagem";
import { Op } from "sequelize";

jest.mock("../models/Chamado", () => ({
  __esModule: true,
  default: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.mock("../models/ChamadoMensagem", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

function mockResponse() {
  const res: any = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("Teste de integração do controller de mensagens", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar uma mensagem válida em um chamado aberto", async () => {
    const req: any = {
      body: {
        chamado_id: 1,
        mensagem: "Meu problema ainda continua acontecendo.",
      },
      usuario: {
        id: 10,
        tipo: "CLIENTE",
      },
    };

    const res = mockResponse();

    (Chamado as any).findByPk.mockResolvedValue({
      id: 1,
      usuario_id: 10,
      tecnico_id: 20,
      status: "EM_ATENDIMENTO",
    });

    const mensagemCriada = {
      id: 1,
      chamado_id: 1,
      usuario_id: 10,
      mensagem: "Meu problema ainda continua acontecendo.",
      anexo: null,
    };

    (ChamadoMensagem as any).create.mockResolvedValue(mensagemCriada);

    await criarMensagem(req, res);

    expect((Chamado as any).findByPk).toHaveBeenCalledWith(1);

    expect((ChamadoMensagem as any).create).toHaveBeenCalledWith(
      expect.objectContaining({
        chamado_id: 1,
        usuario_id: 10,
        mensagem: "Meu problema ainda continua acontecendo.",
        anexo: null,
      }),
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mensagemCriada);
  });

  it("deve retornar erro 400 quando os dados da mensagem forem inválidos", async () => {
    const req: any = {
      body: {
        chamado_id: "",
        mensagem: "",
      },
      usuario: {
        id: 10,
        tipo: "CLIENTE",
      },
    };

    const res = mockResponse();

    await criarMensagem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Dados inválidos",
    });
  });

  it("deve retornar erro 404 quando o chamado não existir", async () => {
    const req: any = {
      body: {
        chamado_id: 999,
        mensagem: "Preciso de ajuda com esse chamado.",
      },
      usuario: {
        id: 10,
        tipo: "CLIENTE",
      },
    };

    const res = mockResponse();

    (Chamado as any).findByPk.mockResolvedValue(null);

    await criarMensagem(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Chamado não encontrado",
    });
  });

  it("deve bloquear envio de mensagem em chamado finalizado", async () => {
    const req: any = {
      body: {
        chamado_id: 1,
        mensagem: "Ainda preciso de ajuda.",
      },
      usuario: {
        id: 10,
        tipo: "CLIENTE",
      },
    };

    const res = mockResponse();

    (Chamado as any).findByPk.mockResolvedValue({
      id: 1,
      usuario_id: 10,
      tecnico_id: 20,
      status: "FINALIZADO",
    });

    await criarMensagem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Chamado finalizado",
    });
  });

  it("deve bloquear cliente tentando enviar mensagem em chamado de outro usuário", async () => {
    const req: any = {
      body: {
        chamado_id: 1,
        mensagem: "Mensagem indevida.",
      },
      usuario: {
        id: 99,
        tipo: "CLIENTE",
      },
    };

    const res = mockResponse();

    (Chamado as any).findByPk.mockResolvedValue({
      id: 1,
      usuario_id: 10,
      tecnico_id: 20,
      status: "EM_ATENDIMENTO",
    });

    await criarMensagem(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Sem permissão",
    });
  });

  it("deve listar mensagens de um chamado quando o usuário tiver permissão", async () => {
    const req: any = {
      params: {
        chamado_id: 1,
      },
      usuario: {
        id: 10,
        tipo: "CLIENTE",
      },
    };

    const res = mockResponse();

    (Chamado as any).findByPk.mockResolvedValue({
      id: 1,
      usuario_id: 10,
      tecnico_id: 20,
      status: "EM_ATENDIMENTO",
    });

    const mensagensMock = [
      {
        id: 1,
        chamado_id: 1,
        usuario_id: 10,
        mensagem: "Meu sistema está com erro.",
      },
      {
        id: 2,
        chamado_id: 1,
        usuario_id: 20,
        mensagem: "Vamos verificar o problema.",
      },
    ];

    (ChamadoMensagem as any).findAll.mockResolvedValue(mensagensMock);

    await listarMensagens(req, res);

    expect((ChamadoMensagem as any).findAll).toHaveBeenCalledWith({
      where: {
        chamado_id: 1,
      },
      order: [["id", "ASC"]],
    });

    expect(res.json).toHaveBeenCalledWith(mensagensMock);
  });

  it("deve listar o resumo das últimas mensagens dos chamados do usuário", async () => {
    const req: any = {
      usuario: {
        id: 10,
        tipo: "CLIENTE",
      },
    };

    const res = mockResponse();

    (Chamado as any).findAll.mockResolvedValue([
      {
        id: 1,
      },
      {
        id: 2,
      },
    ]);

    const mensagensMock = [
      {
        id: 5,
        chamado_id: 2,
        usuario_id: 20,
        mensagem: "Seu chamado está em atendimento.",
        created_at: new Date("2026-01-01T10:00:00"),
      },
      {
        id: 4,
        chamado_id: 1,
        usuario_id: 10,
        mensagem: "Meu notebook não desliga.",
        created_at: new Date("2026-01-01T09:00:00"),
      },
      {
        id: 3,
        chamado_id: 1,
        usuario_id: 20,
        mensagem: "Vamos verificar.",
        created_at: new Date("2026-01-01T08:00:00"),
      },
    ];

    (ChamadoMensagem as any).findAll.mockResolvedValue(mensagensMock);

    await listarResumoMensagens(req, res);

    expect((Chamado as any).findAll).toHaveBeenCalledWith({
      where: {
        usuario_id: 10,
      },
      attributes: ["id"],
    });

    expect((ChamadoMensagem as any).findAll).toHaveBeenCalledWith({
      where: {
        chamado_id: {
          [Op.in]: [1, 2],
        },
      },
      order: [["id", "DESC"]],
    });

    expect(res.json).toHaveBeenCalledWith([
      {
        chamado_id: 2,
        last_message_id: 5,
        last_usuario_id: 20,
        last_mensagem: "Seu chamado está em atendimento.",
        last_created_at: mensagensMock[0].created_at,
      },
      {
        chamado_id: 1,
        last_message_id: 4,
        last_usuario_id: 10,
        last_mensagem: "Meu notebook não desliga.",
        last_created_at: mensagensMock[1].created_at,
      },
    ]);
  });
});