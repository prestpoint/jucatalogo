export const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const truncateText = (value: string, maxLength: number) => {
  const text = value.trim();
  if (text.length <= maxLength) return text;
  if (maxLength <= 1) return "…".slice(0, Math.max(0, maxLength));
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
};

export const truncateTextToLines = (
  value: string,
  maxWidth: number,
  maxLines: number,
  measure: (text: string) => number,
) => {
  const text = value.trim();
  const fits = (candidate: string) => {
    const words = candidate.split(/\s+/);
    let lines = 1;
    let width = 0;

    for (const word of words) {
      const wordWidth = measure(word);
      const nextWidth = width === 0 ? wordWidth : width + measure(" ") + wordWidth;
      if (nextWidth <= maxWidth) {
        width = nextWidth;
        continue;
      }

      lines += 1;
      width = wordWidth;
      if (lines > maxLines || wordWidth > maxWidth) return false;
    }

    return true;
  };

  if (fits(text)) return text;

  for (let length = text.length - 1; length > 0; length -= 1) {
    const candidate = `${text.slice(0, length).trimEnd()}…`;
    if (fits(candidate)) return candidate;
  }

  return "…";
};
