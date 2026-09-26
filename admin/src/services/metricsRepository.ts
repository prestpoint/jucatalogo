export type CatalogMetrics = {
  visitors: number;
  whatsappClicks: number;
  available: boolean;
};

export async function loadCatalogMetrics(): Promise<CatalogMetrics> {
  try {
    const month = new Date().toISOString().slice(0, 7);
    const response = await fetch(`/api/metrics?month=${month}`, { cache: "no-cache" });
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error();
    const data = await response.json() as { visitors?: number; whatsappClicks?: number };
    return { visitors: data.visitors ?? 0, whatsappClicks: data.whatsappClicks ?? 0, available: true };
  } catch {
    return { visitors: 0, whatsappClicks: 0, available: false };
  }
}
