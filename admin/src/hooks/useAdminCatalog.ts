import { useEffect, useMemo, useState } from "react";
import { clearDraft, downloadProducts, downloadStructure, loadAdminCatalog, saveDraft, saveStructureDraft } from "../services/catalogRepository";
import type { AdminCatalog, Category, Product } from "../types";

export type ProductStatus = "all" | "published" | "draft" | "unavailable";

export function useAdminCatalog() {
  const [catalog, setCatalog] = useState<AdminCatalog | null>(null);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState<ProductStatus>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAdminCatalog().then((loaded) => {
      setCatalog(loaded);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Erro ao carregar o painel."));
  }, []);

  const products = catalog?.products ?? [];
  const filteredProducts = useMemo(() => products.filter((product) => {
    const search = query.trim().toLocaleLowerCase("pt-BR");
    const matchesSearch = !search || `${product.nome} ${product.descricao} ${product.volume}`.toLocaleLowerCase("pt-BR").includes(search);
    const matchesBrand = brand === "all" || product.marcaId === brand;
    const matchesStatus = status === "all" || (status === "published" && product.publicado && product.disponivel) || (status === "draft" && !product.publicado) || (status === "unavailable" && !product.disponivel);
    return matchesSearch && matchesBrand && matchesStatus;
  }), [brand, products, query, status]);

  const saveProduct = (product: Product) => {
    if (!catalog) return;
    const exists = products.some((item) => item.id === product.id);
    const next = exists ? products.map((item) => item.id === product.id ? product : item) : [product, ...products];
    saveDraft(next);
    setCatalog({ ...catalog, products: next });
  };

  const saveCategory = (category: Category) => {
    if (!catalog) return;
    const exists = catalog.categories.some((item) => item.id === category.id);
    const categories = exists
      ? catalog.categories.map((item) => item.id === category.id ? category : item)
      : [...catalog.categories, category];
    const validSubcategories = new Set(category.subcategorias.map((item) => item.id));
    const nextProducts = products.map((product) => product.categoriaId === category.id && product.subcategoriaId && !validSubcategories.has(product.subcategoriaId)
      ? { ...product, subcategoriaId: undefined }
      : product);
    saveStructureDraft(catalog.brands, categories);
    saveDraft(nextProducts);
    setCatalog({ ...catalog, categories, products: nextProducts });
  };

  const deleteCategory = (categoryId: string) => {
    if (!catalog || catalog.categories.length <= 1) return;
    const categories = catalog.categories.filter((item) => item.id !== categoryId);
    const fallbackId = categories[0].id;
    const nextProducts = products.map((product) => product.categoriaId === categoryId
      ? { ...product, categoriaId: fallbackId, subcategoriaId: undefined }
      : product);
    saveStructureDraft(catalog.brands, categories);
    saveDraft(nextProducts);
    setCatalog({ ...catalog, categories, products: nextProducts });
  };

  const restoreOriginal = async () => {
    if (!catalog) return;
    clearDraft();
    const restored = await loadAdminCatalog();
    setCatalog(restored);
  };

  return {
    catalog, error, query, setQuery, brand, setBrand, status, setStatus,
    filteredProducts, saveProduct, saveCategory, deleteCategory, restoreOriginal,
    exportProducts: () => downloadProducts(products),
    exportStructure: () => catalog && downloadStructure(catalog.brands, catalog.categories),
  };
}
