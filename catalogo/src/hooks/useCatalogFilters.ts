import { useState } from "react";
import type { CatalogData } from "../data";
import { selectCatalog } from "../catalog/selectCatalog";

export function useCatalogFilters(data: CatalogData) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [onlyHighlights, setOnlyHighlights] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [sort, setSort] = useState("relevance");

  const selection = selectCatalog(data, {
    search,
    category,
    subcategory,
    brands,
    onlyHighlights,
    onlyOffers,
    sort,
  });
  const reset = () => {
    setSearch("");
    setCategory("");
    setSubcategory("");
    setBrands([]);
    setOnlyHighlights(false);
    setOnlyOffers(false);
  };
  const chooseCategory = (id: string) => {
    setCategory(id);
    setSubcategory("");
  };
  const toggleBrand = (id: string) =>
    setBrands((current) =>
      current.includes(id) ? current.filter((b) => b !== id) : [...current, id],
    );

  return {
    ...selection,
    search,
    category,
    subcategory,
    brands,
    onlyHighlights,
    onlyOffers,
    sort,
    setSearch,
    setSubcategory,
    setBrands,
    setOnlyOffers,
    setSort,
    reset,
    chooseCategory,
    toggleBrand,
  };
}

export type CatalogController = ReturnType<typeof useCatalogFilters>;
