import { Download, Edit3, FolderPlus, FolderTree, LockKeyhole, Palette, Server, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AdminCatalog, Category } from "../types";
import { AdminCategoryIcon } from "./CategoryIcons";
import { CategoryEditor } from "./CategoryEditor";

export function CatalogStructure({ catalog, onSave, onDelete }: { catalog: AdminCatalog; onSave: (category: Category) => void; onDelete: (categoryId: string) => void }) {
  const [editing, setEditing] = useState<Category | null | undefined>(undefined);
  const remove = (category: Category) => {
    if (catalog.categories.length <= 1) return window.alert("O catálogo precisa manter pelo menos uma categoria.");
    const products = catalog.products.filter((product) => product.categoriaId === category.id).length;
    const detail = products ? ` Os ${products} produtos vinculados serão movidos para a primeira categoria disponível.` : "";
    if (window.confirm(`Excluir “${category.nome}”?${detail}`)) onDelete(category.id);
  };
  return <section className="structure-section"><div className="section-heading"><div><span>Organização</span><h2>Categorias e marcas</h2></div><button onClick={() => setEditing(null)}><FolderPlus /> Nova categoria</button></div><div className="structure-grid">
    <article><header><FolderTree /><div><h3>Categorias</h3><p>{catalog.categories.length} grupos cadastrados</p></div></header><div className="structure-list">{catalog.categories.map((category) => <div key={category.id}><span className="structure-icon"><AdminCategoryIcon name={category.icone} /></span><div className="structure-name"><span>{category.nome}</span><small>{category.subcategorias.length ? `${category.subcategorias.length} subcategorias` : "Sem subcategorias"}</small></div><div className="structure-actions"><button aria-label={`Editar ${category.nome}`} onClick={() => setEditing(category)}><Edit3 /></button><button aria-label={`Excluir ${category.nome}`} onClick={() => remove(category)}><Trash2 /></button></div></div>)}</div></article>
    <article><header><Palette /><div><h3>Marcas</h3><p>Identidade usada nos cards</p></div></header><div className="brand-list">{catalog.brands.map((brand) => <div key={brand.id}><i style={{ background: brand.cor }} /><span>{brand.nome}</span><small>{brand.cor}</small></div>)}</div></article>
  </div><div className="json-note"><Download /><div><strong>Menu conectado ao estrutura.json</strong><p>O catálogo público lê categorias e subcategorias deste arquivo. “Baixar JSON” gera a versão atualizada para publicação.</p></div></div>{editing !== undefined && <CategoryEditor key={editing?.id ?? "new-category"} category={editing} nextOrder={catalog.categories.length + 1} onClose={() => setEditing(undefined)} onSave={(category) => { onSave(category); setEditing(undefined); }} />}</section>;
}

export function AdminSettings() {
  return <section className="settings-section"><div className="section-heading"><div><span>Configuração</span><h2>Publicação e segurança</h2></div></div><div className="settings-grid"><article><LockKeyhole /><div><h3>Acesso restrito</h3><p>A autenticação será conectada antes da publicação do painel.</p><span>Pendente</span></div></article><article><Server /><div><h3>Cloudflare R2</h3><p>O serviço de gravação substituirá o armazenamento local sem alterar os formulários.</p><span>Pendente</span></div></article></div></section>;
}
