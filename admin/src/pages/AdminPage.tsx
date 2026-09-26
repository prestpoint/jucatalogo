import { useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { AdminHeader } from "../components/AdminHeader";
import { AdminNavigation, type AdminSection } from "../components/AdminNavigation";
import { AdminSettings, CatalogStructure } from "../components/CatalogStructure";
import { DashboardOverview } from "../components/DashboardOverview";
import { ProductEditor } from "../components/ProductEditor";
import { ProductList } from "../components/ProductList";
import { useAdminCatalog } from "../hooks/useAdminCatalog";
import { useCatalogMetrics } from "../hooks/useCatalogMetrics";
import type { Product } from "../types";

const titles: Record<AdminSection, [string, string]> = {
  overview: ["Visão geral", "Bom trabalho, Ju"],
  products: ["Produtos", "Organize seu catálogo"],
  categories: ["Categorias", "Estrutura do catálogo"],
  settings: ["Ajustes", "Publicação e acesso"],
};

export function AdminPage() {
  const admin = useAdminCatalog();
  const metrics = useCatalogMetrics();
  const [section, setSection] = useState<AdminSection>("products");
  const [editing, setEditing] = useState<Product | null | undefined>(undefined);
  const openNew = () => setEditing(null);

  if (admin.error) return <main className="admin-state error"><AlertCircle /><h1>Não foi possível abrir o painel</h1><p>{admin.error}</p></main>;
  if (!admin.catalog) return <main className="admin-state"><LoaderCircle className="spin" /><p>Carregando catálogo...</p></main>;

  const [title, subtitle] = titles[section];
  return <div className="admin-shell">
    <AdminNavigation active={section} onChange={setSection} onNew={openNew} />
    <div className="admin-workspace">
      <AdminHeader title={title} subtitle={subtitle} onExport={section === "categories" ? admin.exportStructure : admin.exportProducts} onRestore={admin.restoreOriginal} />
      <main className="admin-content">
        {section === "overview" && <DashboardOverview catalog={admin.catalog} metrics={metrics} />}
        {section === "products" && <ProductList products={admin.filteredProducts} brands={admin.catalog.brands} query={admin.query} brand={admin.brand} status={admin.status} onQuery={admin.setQuery} onBrand={admin.setBrand} onStatus={admin.setStatus} onEdit={setEditing} onNew={openNew} />}
        {section === "categories" && <CatalogStructure catalog={admin.catalog} onSave={admin.saveCategory} onDelete={admin.deleteCategory} />}
        {section === "settings" && <AdminSettings />}
      </main>
    </div>
    {editing !== undefined && <ProductEditor key={editing?.id ?? "new-product"} product={editing} brands={admin.catalog.brands} categories={admin.catalog.categories} nextOrder={admin.catalog.products.length + 1} onClose={() => setEditing(undefined)} onSave={admin.saveProduct} />}
  </div>;
}
