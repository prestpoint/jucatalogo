import { Grid2X2, Tag } from "lucide-react";
import type { CatalogData } from "../data";

export function BrandTabs({ brands, setBrands, onlyOffers, setOnlyOffers, brandList, products }: {
  brands: string[];
  setBrands: (brands: string[]) => void;
  onlyOffers: boolean;
  setOnlyOffers: (enabled: boolean) => void;
  brandList: CatalogData["marcas"];
  products: CatalogData["produtos"];
}) {
  return <nav className="brand-tabs" aria-label="Selecionar marca">
    <button className={!brands.length && !onlyOffers ? "selected" : ""} aria-pressed={!brands.length && !onlyOffers} onClick={() => { setBrands([]); setOnlyOffers(false); }}><Grid2X2 /><span>Todos os produtos<small>({products.length} itens)</small></span></button>
    {brandList.map((brand) => {
      const imageName = brand.id === "natura" ? "nature" : brand.id === "boticario" ? "oboticario" : brand.id;
      const selected = brands.length === 1 && brands[0] === brand.id;
      const productCount = products.filter((product) => product.marcaId === brand.id).length;
      return <button key={brand.id} className={`brand-button brand-tab-${brand.id} ${selected && !onlyOffers ? "selected" : ""}`} style={{ backgroundImage: `url('/images/${imageName}_brand.png')` }} aria-label={`${brand.nome} (${productCount} produtos)`} aria-pressed={selected && !onlyOffers} onClick={() => { setOnlyOffers(false); setBrands(selected ? [] : [brand.id]); }}><small aria-hidden="true">({productCount} produtos)</small></button>;
    })}
    <button className={`offers-tab ${onlyOffers ? "selected" : ""}`} aria-pressed={onlyOffers} onClick={() => { setBrands([]); setOnlyOffers(!onlyOffers); }}><Tag /><span>Ofertas<small>Preços especiais</small></span></button>
  </nav>;
}
