import type { CatalogData } from "../data";
import { normalize } from "../utils/format";

export interface CatalogFilters {
  search: string;
  category: string;
  subcategory: string;
  brands: string[];
  onlyHighlights: boolean;
  onlyOffers: boolean;
  sort: string;
}

export function selectCatalog(data: CatalogData, filters: CatalogFilters) {
  const { produtos } = data;
  const {
    search,
    category,
    subcategory,
    brands,
    onlyHighlights,
    onlyOffers,
    sort,
  } = filters;
  const categories = data.categorias
    .filter((c) => c.ativo)
    .sort((a, b) => a.ordem - b.ordem);
  const brandList = [...data.marcas].sort((a, b) => a.ordem - b.ordem);
  const selectedCategory = categories.find((c) => c.id === category);
  const selectedSub = selectedCategory?.subcategorias.find(
    (s) => s.id === subcategory,
  );
  const activeSubs =
    selectedCategory?.subcategorias
      .filter((s) => s.ativo)
      .sort((a, b) => a.ordem - b.ordem) || [];
  const hasFilters = !!(
    search ||
    category ||
    brands.length ||
    onlyHighlights ||
    onlyOffers
  );
  const activeCount =
    Number(!!category) +
    brands.length +
    Number(onlyHighlights) +
    Number(onlyOffers);
  const visible = produtos
    .filter((p) => {
      const brand = brandList.find((b) => b.id === p.marcaId)!;
      return (
        (!category || p.categoriaId === category) &&
        (!subcategory || p.subcategoriaId === subcategory) &&
        (!brands.length || brands.includes(p.marcaId)) &&
        (!onlyHighlights || p.relevancia === 3) &&
        (!onlyOffers ||
          (p.precoAnterior != null && p.precoAnterior > p.preco)) &&
        normalize(`${p.nome} ${p.descricao} ${brand.nome}`).includes(
          normalize(search.trim()),
        )
      );
    })
    .sort((a, b) =>
      sort === "price-asc"
        ? a.preco - b.preco
        : sort === "price-desc"
          ? b.preco - a.preco
          : sort === "name"
            ? a.nome.localeCompare(b.nome, "pt-BR")
            : b.relevancia - a.relevancia || a.ordem - b.ordem,
    );

  return {
    categories,
    brandList,
    selectedCategory,
    selectedSub,
    activeSubs,
    hasFilters,
    activeCount,
    visible,
  };
}
