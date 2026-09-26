import { useEffect, useState } from "react";
import { loadCatalogMetrics, type CatalogMetrics } from "../services/metricsRepository";

const initialMetrics: CatalogMetrics = { visitors: 0, whatsappClicks: 0, available: false };

export function useCatalogMetrics() {
  const [metrics, setMetrics] = useState(initialMetrics);
  useEffect(() => { void loadCatalogMetrics().then(setMetrics); }, []);
  return metrics;
}
