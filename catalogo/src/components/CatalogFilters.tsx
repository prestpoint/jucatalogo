import { ChevronDown, Grid2X2, ShoppingBag, Tag } from "lucide-react";
import type { CatalogData } from "../data";
import type { CatalogController } from "../hooks/useCatalogFilters";
import { CategoryIcon } from "./CategoryIcon";

export function CatalogFilters({
  catalog,
  produtos,
}: {
  catalog: Pick<
    CatalogController,
    | "category"
    | "subcategory"
    | "brands"
    | "categories"
    | "activeSubs"
    | "brandList"
    | "chooseCategory"
    | "setSubcategory"
    | "toggleBrand"
  >;
  produtos: CatalogData["produtos"];
}) {
  const {
    category,
    subcategory,
    brands,
    categories,
    activeSubs,
    brandList,
    chooseCategory,
    setSubcategory,
    toggleBrand,
  } = catalog;
  return (
    <>
      <h2 className="filter-title">
        <Grid2X2 size={19} /> Categorias
      </h2>
      <nav className="category-list" aria-label="Categorias de produtos">
        <button
          className={!category ? "selected" : ""}
          aria-pressed={!category}
          onClick={() => chooseCategory("")}
        >
          <ShoppingBag size={19} />
          <span>Todos os produtos</span>
        </button>
        {categories.map((c) => (
          <div key={c.id}>
            <button
              className={category === c.id ? "selected" : ""}
              aria-pressed={category === c.id}
              aria-expanded={
                c.subcategorias.some((s) => s.ativo)
                  ? category === c.id
                  : undefined
              }
              onClick={() => chooseCategory(c.id)}
            >
              <CategoryIcon name={c.icone} />
              <span>{c.nome}</span>
              {c.subcategorias.some((s) => s.ativo) && (
                <ChevronDown
                  size={14}
                  className={category === c.id ? "rotated" : ""}
                />
              )}
            </button>
            {category === c.id && activeSubs.length > 0 && (
              <div className="subcategory-list">
                {activeSubs.map((s) => (
                  <button
                    key={s.id}
                    aria-pressed={subcategory === s.id}
                    className={subcategory === s.id ? "active" : ""}
                    onClick={() =>
                      setSubcategory(subcategory === s.id ? "" : s.id)
                    }
                  >
                    {s.nome}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="filter-divider" />
      <h2 className="filter-title">
        <Tag size={19} /> Filtrar por marca
      </h2>
      <div className="checkbox-list">
        {brandList.map((b) => (
          <label key={b.id}>
            <input
              type="checkbox"
              checked={brands.includes(b.id)}
              onChange={() => toggleBrand(b.id)}
            />
            <span>{b.nome}</span>
            <small>{produtos.filter((p) => p.marcaId === b.id).length}</small>
          </label>
        ))}
      </div>
    </>
  );
}
