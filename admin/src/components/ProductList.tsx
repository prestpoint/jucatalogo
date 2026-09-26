import { Edit3, Search, SlidersHorizontal } from "lucide-react";
import type { ProductStatus } from "../hooks/useAdminCatalog";
import type { Brand, Product } from "../types";
import { previewAssetUrl } from "../services/catalogRepository";

const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ProductList({ products, brands, query, brand, status, onQuery, onBrand, onStatus, onEdit, onNew }: {
  products: Product[];
  brands: Brand[];
  query: string;
  brand: string;
  status: ProductStatus;
  onQuery: (value: string) => void;
  onBrand: (value: string) => void;
  onStatus: (value: ProductStatus) => void;
  onEdit: (product: Product) => void;
  onNew: () => void;
}) {
  return <section className="products-section">
    <div className="section-heading"><div><span>Catálogo</span><h2>Gerenciar produtos</h2></div><button onClick={onNew}>Adicionar produto</button></div>
    <div className="product-tools">
      <label className="admin-search"><Search /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Buscar produto..." /></label>
      <div className="filter-row"><label><SlidersHorizontal /><select value={brand} onChange={(event) => onBrand(event.target.value)}><option value="all">Todas as marcas</option>{brands.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label><label><select value={status} onChange={(event) => onStatus(event.target.value as ProductStatus)}><option value="all">Todos os status</option><option value="published">Publicados</option><option value="draft">Rascunhos</option><option value="unavailable">Indisponíveis</option></select></label></div>
    </div>
    <div className="product-count"><strong>{products.length}</strong> {products.length === 1 ? "produto encontrado" : "produtos encontrados"}</div>
    <div className="admin-product-grid">{products.map((product) => {
      const itemBrand = brands.find((item) => item.id === product.marcaId);
      return <article className="admin-product-card" key={product.id}>
        <div className="admin-product-image"><img src={previewAssetUrl(product.imagens[0]?.src ?? "")} alt="" /><span className={`status-dot ${product.publicado && product.disponivel ? "online" : "offline"}`} /></div>
        <div className="admin-product-copy"><div><span className="brand-chip" style={{ "--brand-color": itemBrand?.cor } as React.CSSProperties}>{itemBrand?.nome}</span><small>{product.volume}</small></div><h3>{product.nome}</h3><p>{product.descricao}</p><footer><strong>{money(product.preco)}</strong><span>Relevância {product.relevancia}</span></footer></div>
        <button className="edit-product" aria-label={`Editar ${product.nome}`} onClick={() => onEdit(product)}><Edit3 /></button>
      </article>;
    })}</div>
    {!products.length && <div className="empty-products"><Search /><h3>Nenhum produto encontrado</h3><p>Ajuste a busca ou os filtros.</p></div>}
  </section>;
}
