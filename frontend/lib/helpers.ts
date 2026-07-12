export function truncate(
  text: string,
  limit = 40
) {
  if (text.length <= limit) return text;

  return text.slice(0, limit) + "...";
}