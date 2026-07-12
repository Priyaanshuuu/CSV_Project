export function formatPhone(
  code?: string,
  phone?: string
) {
  return `${code ?? ""} ${phone ?? ""}`.trim();
}