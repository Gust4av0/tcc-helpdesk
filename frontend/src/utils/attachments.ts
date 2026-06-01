import type { AttachmentPayload } from "../services/message";

export const MAX_ATTACHMENT_BYTES = 50 * 1024 * 1024;

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".bmp",
  ".avif",
  ".heic",
  ".heif",
]);

const PDF_EXTENSIONS = new Set([".pdf"]);
const PDF_MIME_TYPES = new Set(["application/pdf", "application/x-pdf"]);

function getExtension(fileName?: string) {
  const cleanName = (fileName ?? "").toLowerCase().split(/[?#]/)[0];
  const dotIndex = cleanName.lastIndexOf(".");

  return dotIndex >= 0 ? cleanName.slice(dotIndex) : "";
}

function getDataUrlMime(dataUrl?: string) {
  return dataUrl?.match(/^data:([^;,]+)/i)?.[1]?.toLowerCase() ?? "";
}

export function inferAttachmentType(
  type?: string,
  name?: string,
  dataUrl?: string,
) {
  const normalizedType = type?.trim().toLowerCase();
  const dataUrlType = getDataUrlMime(dataUrl);
  const extension = getExtension(name);

  if (normalizedType && normalizedType !== "application/octet-stream") {
    return normalizedType;
  }

  if (dataUrlType && dataUrlType !== "application/octet-stream") {
    return dataUrlType;
  }

  if (IMAGE_EXTENSIONS.has(extension)) {
    return extension === ".jpg" ? "image/jpeg" : `image/${extension.slice(1)}`;
  }

  if (PDF_EXTENSIONS.has(extension)) {
    return "application/pdf";
  }

  return normalizedType || dataUrlType || "application/octet-stream";
}

export function parseAttachment(raw?: string | null): AttachmentPayload | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AttachmentPayload> | string;

    if (typeof parsed === "string") {
      return {
        name: "anexo",
        type: inferAttachmentType(undefined, "anexo", parsed),
        dataUrl: parsed,
      };
    }

    if (!parsed || typeof parsed !== "object" || !parsed.dataUrl) {
      return null;
    }

    const name = parsed.name?.trim() || "anexo";

    return {
      name,
      type: inferAttachmentType(parsed.type, name, parsed.dataUrl),
      dataUrl: parsed.dataUrl,
    };
  } catch {
    return {
      name: "anexo",
      type: inferAttachmentType(undefined, "anexo", raw),
      dataUrl: raw,
    };
  }
}

export function isImageAttachment(attachment: AttachmentPayload) {
  const type = inferAttachmentType(
    attachment.type,
    attachment.name,
    attachment.dataUrl,
  );

  return (
    (type.startsWith("image/") && type !== "image/svg+xml") ||
    IMAGE_EXTENSIONS.has(getExtension(attachment.name))
  );
}

export function isPdfAttachment(attachment: AttachmentPayload) {
  const type = inferAttachmentType(
    attachment.type,
    attachment.name,
    attachment.dataUrl,
  );

  return PDF_MIME_TYPES.has(type) || PDF_EXTENSIONS.has(getExtension(attachment.name));
}

export function isSupportedAttachmentFile(file: File) {
  const type = file.type.toLowerCase();
  const extension = getExtension(file.name);

  return (
    (type.startsWith("image/") && type !== "image/svg+xml") ||
    PDF_MIME_TYPES.has(type) ||
    IMAGE_EXTENSIONS.has(extension) ||
    PDF_EXTENSIONS.has(extension)
  );
}

function dataUrlToBlob(dataUrl: string, fallbackType: string) {
  const separatorIndex = dataUrl.indexOf(",");
  if (!dataUrl.startsWith("data:") || separatorIndex < 0) return null;

  const metadata = dataUrl.slice(0, separatorIndex);
  const data = dataUrl.slice(separatorIndex + 1);
  const mimeType = getDataUrlMime(dataUrl) || fallbackType || "application/octet-stream";

  if (/;base64/i.test(metadata)) {
    const binary = window.atob(data.replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: mimeType });
  }

  const decoded = decodeURIComponent(data);
  const bytes = new Uint8Array(decoded.length);

  for (let index = 0; index < decoded.length; index += 1) {
    bytes[index] = decoded.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

export function openAttachment(attachment: AttachmentPayload) {
  if (!attachment.dataUrl) return;

  let url = attachment.dataUrl;
  let blob: Blob | null = null;

  try {
    blob = dataUrlToBlob(attachment.dataUrl, attachment.type);
  } catch {
    blob = null;
  }

  if (blob) {
    url = URL.createObjectURL(blob);
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  window.open(url, "_blank", "noopener,noreferrer");
}
