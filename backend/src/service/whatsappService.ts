export const enviarMensagemWhatsApp = async (
  telefone: string | null | undefined,
  mensagem: string,
) => {
  const telefoneDestino = telefone?.replace(/\D/g, "");

  if (!telefoneDestino) {
    console.log("[WHATSAPP] Cliente sem telefone cadastrado");
    return false;
  }

  console.log("\n==================================");
  console.log("📱 NOTIFICAÇÃO WHATSAPP");
  console.log("==================================");
  console.log("📞 Destinatário:", telefoneDestino);
  console.log("💬 Mensagem:");
  console.log(mensagem);
  console.log("==================================\n");

  return true;
};