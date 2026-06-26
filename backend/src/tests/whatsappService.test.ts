import { enviarMensagemWhatsApp } from "../service/whatsappService";

describe("Teste unitário do serviço de WhatsApp", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve simular o envio de mensagem quando o telefone for informado", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});

    const resultado = await enviarMensagemWhatsApp(
      "(11) 99999-9999",
      "Seu chamado foi aberto com sucesso.",
    );

    expect(resultado).toBe(true);
  });

  it("deve retornar false quando o cliente não tiver telefone cadastrado", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});

    const resultado = await enviarMensagemWhatsApp(
      null,
      "Seu chamado foi aberto com sucesso.",
    );

    expect(resultado).toBe(false);
  });

  it("deve limpar caracteres do telefone antes de simular o envio", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await enviarMensagemWhatsApp(
      "+55 (11) 98888-7777",
      "Seu chamado entrou em atendimento.",
    );

    expect(consoleSpy).toHaveBeenCalledWith("📞 Destinatário:", "5511988887777");
  });
});