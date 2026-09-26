import { RelevanceHeart } from "./RelevanceHeart";
import type { CatalogData, Product } from "../data";
import { money, truncateText, truncateTextToLines } from "../utils/format";
import { Photo } from "./Photo";

let productNameContext: CanvasRenderingContext2D | null = null;

const measureProductName = (text: string) => {
  if (!productNameContext) {
    productNameContext = document.createElement("canvas").getContext("2d");
    if (productNameContext) productNameContext.font = "500 14px 'DM Sans'";
  }

  return productNameContext?.measureText(text).width ?? text.length * 7;
};

export function ProductCard({ product, brand, compact, onDetails }: { product: Product; brand: CatalogData["marcas"][number]; compact: boolean; onDetails: (product: Product) => void }) {
  const displayName = compact
    ? truncateTextToLines(product.nome, 88, 2, measureProductName)
    : truncateText(product.nome, 60);

  return <article className="product-card">
    <button className="product-visual" onClick={() => onDetails(product)} aria-label={`Ver detalhes de ${product.nome}`}><Photo image={product.imagens[0]} /><span className="highlight"><RelevanceHeart level={product.relevancia} /></span></button>
    <div className="product-info"><span className={`product-brand brand-${brand.id}`}>{brand.nome}</span><h3 title={displayName === product.nome ? undefined : product.nome}>{displayName}</h3><span className="product-volume">{product.volume}</span><strong className="product-price">{money(product.preco)}</strong></div>
  </article>;
}
