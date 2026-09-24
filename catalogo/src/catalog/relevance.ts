export const relevanceLevels = {
  1: { color: '#FAF6F2', label: 'Relevância 1 de 3 — Nude' },
  2: { color: '#EBC9C1', label: 'Relevância 2 de 3 — Rosa suave' },
  3: { color: '#D98293', label: 'Relevância 3 de 3 — Rosa principal' },
} as const;

export type RelevanceLevel = keyof typeof relevanceLevels;
