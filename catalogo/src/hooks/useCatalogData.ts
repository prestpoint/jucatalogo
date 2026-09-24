import { useEffect, useState } from "react";
import { loadCatalog, type CatalogData } from "../data";

export function useCatalogData() {
  const [data, setData] = useState<CatalogData | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    loadCatalog(controller.signal)
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [retry]);

  return { data, error, retry: () => setRetry((n) => n + 1) };
}
