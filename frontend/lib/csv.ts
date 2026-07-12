export function getPreviewRows<T>(
  rows: T[],
  limit = 10
) {
  return rows.slice(0, limit);
}