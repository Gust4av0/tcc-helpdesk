import * as fs from "fs";
import * as path from "path";

const logsDir = path.resolve(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const successLogPath = path.join(logsDir, "categoria-success.log");
const errorLogPath = path.join(logsDir, "categoria-error.log");

if (!fs.existsSync(successLogPath)) {
  fs.writeFileSync(successLogPath, "", "utf8");
}

if (!fs.existsSync(errorLogPath)) {
  fs.writeFileSync(errorLogPath, "", "utf8");
}

const formatarData = () => {
  return new Date().toLocaleString("pt-BR");
};

const formatarValor = (valor: unknown) => {
  if (valor === null || valor === undefined || valor === "") {
    return "Não informado";
  }

  if (Array.isArray(valor)) {
    return valor.join(", ");
  }

  if (typeof valor === "object") {
    return JSON.stringify(valor, null, 2);
  }

  return String(valor);
};

const formatarDetalhes = (detalhes?: unknown) => {
  if (!detalhes) {
    return "- Nenhum detalhe adicional";
  }

  if (detalhes instanceof Error) {
    return [
      `- Nome do erro: ${detalhes.name}`,
      `- Mensagem: ${detalhes.message}`,
      `- Stack: ${detalhes.stack || "Não disponível"}`,
    ].join("\n");
  }

  if (typeof detalhes === "object") {
    return Object.entries(detalhes as Record<string, unknown>)
      .map(([chave, valor]) => {
        const nomeCampo = chave
          .replace(/_/g, " ")
          .replace(/\b\w/g, (letra) => letra.toUpperCase());

        return `- ${nomeCampo}: ${formatarValor(valor)}`;
      })
      .join("\n");
  }

  return `- ${String(detalhes)}`;
};

const escreverLog = (
  arquivo: string,
  tipo: "SUCESSO" | "ERRO",
  mensagem: string,
  detalhes?: unknown,
) => {
  const icone = tipo === "SUCESSO" ? "✅" : "❌";
  const data = formatarData();
  const detalhesFormatados = formatarDetalhes(detalhes);

  const conteudo = [
    "============================================================",
    `${icone} ${tipo} | ${data}`,
    `Ação: ${mensagem}`,
    "",
    "Detalhes:",
    detalhesFormatados,
    "============================================================",
    "",
  ].join("\n");

  fs.appendFileSync(path.join(logsDir, arquivo), conteudo, "utf8");

  console.log(conteudo);
};

export const logCategoriaSucesso = (
  mensagem: string,
  detalhes?: unknown,
) => {
  escreverLog("categoria-success.log", "SUCESSO", mensagem, detalhes);
};

export const logCategoriaErro = (
  mensagem: string,
  detalhes?: unknown,
) => {
  escreverLog("categoria-error.log", "ERRO", mensagem, detalhes);
};