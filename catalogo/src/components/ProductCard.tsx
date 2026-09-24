import { ArrowRight } from "lucide-react";
import { RelevanceHeart } from "./RelevanceHeart";
import type { CatalogData, Product } from "../data";
import { money } from "../utils/format";
import { Photo } from "./Photo";

export function ProductCard({
  product: p,
  brand,
  onDetails,
}: {
  product: Product;
  brand: CatalogData["marcas"][number];
  onDetails: (product: Product) => void;
}) {
  const discount =
    p.precoAnterior && p.precoAnterior > p.preco
      ? Math.round((1 - p.preco / p.precoAnterior) * 100)
      : 0;
  return (
    <article className="product-card">
      <div className="product-visual">
        <Photo image={p.imagens[0]} />
        {discount > 0 && <span className="discount">−{discount}%</span>}
        <span className="highlight"><RelevanceHeart level={p.relevancia} /></span>
      </div>
      <div className="product-info">
        <span className="product-brand" style={{ color: brand.cor }}>
          {brand.nome}
        </span>
        <h3>{p.nome}</h3>
        <span className="product-volume">
          {p.descricao.split(". ")[0]} {p.volume}
        </span>
        <div className="product-price">
          <strong>{money(p.preco)}</strong>
          {discount > 0 && <del>{money(p.precoAnterior!)}</del>}
        </div>
        <span className={`availability ${!p.disponivel ? "unavailable" : ""}`}>
          <span />
          {p.disponivel ? "Disponível" : "Indisponível no momento"}
        </span>
        <button
          className="details-button"
          onClick={() => onDetails(p)}
          aria-label={`Ver detalhes de ${p.nome}`}
        >
          Ver detalhes <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}
