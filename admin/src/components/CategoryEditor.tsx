import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Category, Subcategory } from "../types";
import { categoryIconOptions, normalizeCategoryIcon } from "./CategoryIcons";

const slug = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export function CategoryEditor({ category, nextOrder, onClose, onSave }: { category: Category | null; nextOrder: number; onClose: () => void; onSave: (category: Category) => void }) {
  const [name, setName] = useState(category?.nome ?? "");
  const [icon, setIcon] = useState(normalizeCategoryIcon(category?.icone ?? "grid"));
  const [iconsOpen, setIconsOpen] = useState(false);
  const [active, setActive] = useState(category?.ativo ?? true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(category?.subcategorias ?? []);
  const addSubcategory = () => setSubcategories((current) => [...current, { id: `nova-${Date.now()}`, nome: "", ordem: current.length + 1, ativo: true }]);
  const save = () => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const cleanSubcategories = subcategories.map((item, index) => ({ ...item, id: item.id.startsWith("nova-") ? slug(item.nome) || `subcategoria-${index + 1}` : item.id, nome: item.nome.trim(), ordem: index + 1 })).filter((item) => item.nome);
    onSave({ id: category?.id ?? slug(cleanName), nome: cleanName, icone: icon, ordem: category?.ordem ?? nextOrder, ativo: active, subcategorias: cleanSubcategories });
  };
  return <div className="editor-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="category-editor" role="dialog" aria-modal="true" aria-label={category ? "Editar categoria" : "Nova categoria"}>
    <header><div><span>{category ? "Edição" : "Cadastro"}</span><h2>{category?.nome ?? "Nova categoria"}</h2></div><button aria-label="Fechar" onClick={onClose}><X /></button></header>
    <div className="category-editor-content">
      <div className="category-main-fields"><label>Nome da categoria<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Perfumaria" /></label></div>
      <fieldset className={`category-icon-picker ${iconsOpen ? "open" : ""}`}><legend>Ícone do menu</legend><button type="button" className="icon-picker-toggle" aria-expanded={iconsOpen} onClick={() => setIconsOpen((current) => !current)}>{categoryIconOptions.map(({ id, label, icon: Icon }) => id === icon && <span key={id}><Icon /><span><strong>{label}</strong><small>Toque para escolher outro ícone</small></span></span>)}<ChevronDown /></button>{iconsOpen && <div className="icon-picker-options">{categoryIconOptions.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={icon === id ? "selected" : ""} aria-pressed={icon === id} onClick={() => { setIcon(id); setIconsOpen(false); }}><Icon /><span>{label}</span>{icon === id && <Check />}</button>)}</div>}</fieldset>
      <label className="category-active"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /><span><strong>Categoria ativa</strong><small>Exibir no menu do catálogo</small></span></label>
      <div className="subcategory-heading"><div><h3>Subcategorias</h3><p>Organize as opções internas deste grupo.</p></div><button onClick={addSubcategory}><Plus /> Adicionar</button></div>
      <div className="subcategory-list">{subcategories.map((item, index) => <div key={item.id}><span>{index + 1}</span><input aria-label={`Nome da subcategoria ${index + 1}`} value={item.nome} onChange={(event) => setSubcategories((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, nome: event.target.value } : entry))} placeholder="Nome da subcategoria" /><button aria-label={`Remover subcategoria ${index + 1}`} onClick={() => setSubcategories((current) => current.filter((_, entryIndex) => entryIndex !== index))}><Trash2 /></button></div>)}</div>
      {!subcategories.length && <div className="empty-subcategories">Esta categoria ainda não possui subcategorias.</div>}
    </div>
    <footer><button className="secondary" onClick={onClose}>Cancelar</button><button className="primary" onClick={save}><Check /> Salvar categoria</button></footer>
  </section></div>;
}
