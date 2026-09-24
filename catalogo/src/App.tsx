import { useCatalogData } from "./hooks/useCatalogData";
import { CatalogLoading } from "./components/CatalogLoading";
import { CatalogPage } from "./pages/CatalogPage";

export default function App() {
  const { data, error, retry } = useCatalogData();
  if (!data) return <CatalogLoading error={error} onRetry={retry} />;
  return <CatalogPage data={data} />;
}
