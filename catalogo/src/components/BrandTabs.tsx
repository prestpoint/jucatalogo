import { Grid2X2 } from "lucide-react";
import type { CSSProperties } from "react";
import type { CatalogData } from "../data";

export function BrandTabs({
  brands,
  setBrands,
  brandList,
  produtos,
}: {
  brands: string[];
  setBrands: (brands: string[]) => void;
  brandList: CatalogData["marcas"];
  produtos: CatalogData["produtos"];
}) {
  return (
    <div className="brand-tabs" aria-label="Selecionar marca">
      <button
        aria-pressed={!brands.length}
        className={!brands.length ? "selected" : ""}
        onClick={() => setBrands([])}
      >
        <Grid2X2 />
        <span>
          Todos os produtos<small>({produtos.length} itens)</small>
        </span>
      </button>
      {brandList.map((b) => (
        <button
          key={b.id}
          style={{ "--brand-color": b.cor } as CSSProperties}
          aria-pressed={brands.includes(b.id)}
          className={`brand-tab ${brands.includes(b.id) ? "selected" : ""}`}
          onClick={() =>
            setBrands(brands.length === 1 && brands[0] === b.id ? [] : [b.id])
          }
        >
          <span className={`product-brand-lockup ${b.id}`}>
            <img
              src={`/images/${b.id === "natura" ? "nature" : b.id === "boticario" ? "oboticario" : b.id}_brand.png`}
              alt={b.nome}
            />
            <small>
              ({produtos.filter((p) => p.marcaId === b.id).length} produtos)
            </small>
          </span>
        </button>
      ))}
    </div>
  );
}
