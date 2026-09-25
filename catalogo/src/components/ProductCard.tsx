import { RelevanceHeart } from "./RelevanceHeart";
import type { CatalogData, Product } from "../data";
import { money } from "../utils/format";
import { Photo } from "./Photo";

export function ProductCard({ product, brand, onDetails }: { product: Product; brand: CatalogData["marcas"][number]; onDetails: (product: Product) => void }) {
  return <article className="product-card">
    <button className="product-visual" onClick={() => onDetails(product)} aria-label={`Ver detalhes de ${product.nome}`}><Photo image={product.imagens[0]} /><span className="highlight"><RelevanceHeart level={product.relevancia} /></span></button>
    <div className="product-info"><span className={`product-brand brand-${brand.id}`}>{brand.nome}</span><h3>{product.nome}</h3><span className="product-volume">{product.volume}</span><strong className="product-price">{money(product.preco)}</strong></div>
  </article>;
}
