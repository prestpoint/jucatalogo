import { Boxes, FolderTree, LayoutDashboard, Plus, Settings } from "lucide-react";

export type AdminSection = "overview" | "products" | "categories" | "settings";

const items = [
  { id: "overview" as const, label: "Visão geral", icon: LayoutDashboard },
  { id: "products" as const, label: "Produtos", icon: Boxes },
  { id: "categories" as const, label: "Categorias", icon: FolderTree },
  { id: "settings" as const, label: "Ajustes", icon: Settings },
];

export function AdminNavigation({ active, onChange, onNew }: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  onNew: () => void;
}) {
  return <>
    <aside className="admin-sidebar">
      <div className="admin-brand"><span>J</span><div><strong>Ju Catálogo</strong><small>Administração</small></div></div>
      <button className="new-product" onClick={onNew}><Plus /> Novo produto</button>
      <nav aria-label="Navegação do painel">{items.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? "active" : ""} onClick={() => onChange(id)}><Icon />{label}</button>)}</nav>
      <div className="sidebar-status"><span /><div><strong>Modo local</strong><small>Sem conexão com o R2</small></div></div>
    </aside>
    <nav className="mobile-nav" aria-label="Navegação do painel">
      {items.slice(0, 2).map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? "active" : ""} onClick={() => onChange(id)}><Icon /><span>{label}</span></button>)}
      <button className="mobile-new" onClick={onNew} aria-label="Novo produto"><Plus /></button>
      {items.slice(2).map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? "active" : ""} onClick={() => onChange(id)}><Icon /><span>{label}</span></button>)}
    </nav>
  </>;
}
