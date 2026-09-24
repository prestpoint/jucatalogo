import {
  ArrowDownWideNarrow,
  ArrowRight,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { CatalogData, Product } from "../data";
import type { CatalogController } from "../hooks/useCatalogFilters";
import { BrandTabs } from "./BrandTabs";
import { ProductCard } from "./ProductCard";

export function CatalogResults({
  catalog,
  data,
  onOpenFilters,
  onDetails,
}: {
  catalog: CatalogController;
  data: CatalogData;
  onOpenFilters: () => void;
  onDetails: (product: Product) => void;
}) {
  const {
    search,
    subcategory,
    brands,
    onlyHighlights,
    onlyOffers,
    sort,
    setSort,
    setSubcategory,
    setBrands,
    selectedSub,
    selectedCategory,
    activeSubs,
    hasFilters,
    activeCount,
    visible,
    brandList,
    reset,
  } = catalog;
  const { loja, produtos } = data;
  return (
    <section className="catalog-results" aria-label="Catálogo de produtos">
      <BrandTabs
        brands={brands}
        setBrands={setBrands}
        brandList={brandList}
        produtos={produtos}
      />
      <div className="results-heading">
        <div>
          <h2>
            {selectedSub?.nome ||
              selectedCategory?.nome ||
              (onlyHighlights
                ? "Destaques da Ju"
                : onlyOffers
                  ? "Ofertas especiais"
                  : "Todos os produtos")}
          </h2>
        </div>
        <span className="result-count" role="status">
          {visible.length} {visible.length === 1 ? "produto" : "produtos"}
        </span>
      </div>
      <div className="toolbar">
        <button className="filter-mobile" onClick={() => onOpenFilters()}>
          <SlidersHorizontal size={17} /> Filtros{" "}
          {activeCount > 0 && <b>{activeCount}</b>}
        </button>
        <label className="sort">
          <ArrowDownWideNarrow size={16} />
          <select
            aria-label="Ordenar produtos"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="relevance">Mais relevantes</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="name">Nome: A a Z</option>
          </select>
        </label>
      </div>
      {activeSubs.length > 0 && (
        <div className="sub-pills" aria-label="Subcategorias">
          <button
            className={!subcategory ? "active" : ""}
            aria-pressed={!subcategory}
            onClick={() => setSubcategory("")}
          >
            Todos em {selectedCategory?.nome}
          </button>
          {activeSubs.map((s) => (
            <button
              key={s.id}
              className={subcategory === s.id ? "active" : ""}
              aria-pressed={subcategory === s.id}
              onClick={() => setSubcategory(s.id)}
            >
              {s.nome}
            </button>
          ))}
        </div>
      )}
      {hasFilters && (
        <div className="active-filters">
          <span>
            {search
              ? `Busca: “${search}”`
              : [
                  selectedCategory?.nome,
                  selectedSub?.nome,
                  ...brandList
                    .filter((b) => brands.includes(b.id))
                    .map((b) => b.nome),
                  onlyHighlights && "Destaques",
                  onlyOffers && "Ofertas",
                ]
                  .filter(Boolean)
                  .join(" · ")}
          </span>
          <button onClick={reset}>
            Limpar <X size={13} />
          </button>
        </div>
      )}
      {visible.length ? (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              brand={brandList.find((b) => b.id === p.marcaId)!}
              onDetails={onDetails}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Search size={32} />
          <h3>Nenhum produto por aqui ainda</h3>
          <p>Tente outra busca ou explore os outros cuidados do catálogo.</p>
          <button className="primary" onClick={reset}>
            Ver todos os produtos <ArrowRight size={16} />
          </button>
        </div>
      )}
      <div className="catalog-end">
        <Heart size={16} />
        <span>
          {loja.demonstracao
            ? "Seleção demonstrativa • imagens e preços de referência"
            : "Cada escolha, um carinho com você."}
        </span>
      </div>
    </section>
  );
}
