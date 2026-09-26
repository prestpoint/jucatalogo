import { useState } from "react";
import { ArrowDownWideNarrow, Grid2X2, Search, SlidersHorizontal } from "lucide-react";
import type { CatalogData, Product } from "../data";
import type { CatalogController } from "../hooks/useCatalogFilters";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ProductCard } from "./ProductCard";
import { BrandTabs } from "./BrandTabs";

export function CatalogResults({ catalog, data, onOpenFilters, onDetails }: { catalog: CatalogController; data: CatalogData; onOpenFilters: () => void; onDetails: (product: Product) => void }) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [desktopColumns, setDesktopColumns] = useState<3 | 4>(3);
  const [mobileColumns, setMobileColumns] = useState<2 | 3>(2);
  const columns = isMobile ? mobileColumns : desktopColumns;
  const nextColumns = isMobile ? (mobileColumns === 2 ? 3 : 2) : (desktopColumns === 3 ? 4 : 3);
  const toggleColumns = () => {
    if (isMobile) setMobileColumns((current) => current === 2 ? 3 : 2);
    else setDesktopColumns((current) => current === 3 ? 4 : 3);
  };
  const { brands, onlyOffers, sort, setSort, selectedSub, selectedCategory, activeCount, visible, brandList, reset } = catalog;
  const title = selectedSub?.nome || selectedCategory?.nome || (onlyOffers ? "Ofertas" : "Produtos");
  return <section className="catalog-results" aria-label="Catálogo de produtos">
    <div className="catalog-controls">
      <BrandTabs brands={brands} setBrands={catalog.setBrands} onlyOffers={onlyOffers} setOnlyOffers={catalog.setOnlyOffers} brandList={brandList} products={data.produtos} />
      <div className="catalog-toolbar"><div><h2>{title}</h2><span role="status">{visible.length} {visible.length === 1 ? "produto" : "produtos"}</span></div><div className="toolbar-actions"><button className="filter-trigger" onClick={onOpenFilters}><SlidersHorizontal /> Filtros {activeCount > 0 && <b>{activeCount}</b>}</button><button className="view-toggle" type="button" aria-label={`Exibir ${nextColumns} produtos por linha`} title={`Exibindo ${columns} produtos por linha`} onClick={toggleColumns}><Grid2X2 aria-hidden="true" /><span>{columns}</span></button><label className="sort"><ArrowDownWideNarrow /><select aria-label="Ordenar produtos" value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevance">Mais relevantes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome: A a Z</option></select></label></div></div>
    </div>
    {visible.length ? <div className={`product-grid grid-columns-${columns}`}>{visible.map((product) => <ProductCard key={product.id} product={product} brand={brandList.find((brand) => brand.id === product.marcaId)!} onDetails={onDetails} />)}</div> : <div className="empty"><Search /><h3>Nenhum produto encontrado</h3><p>Tente outra busca ou ajuste os filtros.</p><button onClick={reset}>Ver todos os produtos</button></div>}
    {data.loja.demonstracao}
  </section>;
}
