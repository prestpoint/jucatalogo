import type { AdminCatalog, Category, Product } from "../types";

const productDraftKey = "ju-admin-products-draft-v1";
const structureDraftKey = "ju-admin-structure-draft-v1";
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

export const previewAssetUrl = (src: string) => src.startsWith("/") ? `${baseUrl}${src}` : src;

async function readJson(path: string) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error("Não foi possível carregar os dados do catálogo.");
  return response.json() as Promise<unknown>;
}

export async function loadAdminCatalog(): Promise<AdminCatalog> {
  const [structure, productFile] = await Promise.all([
    readJson(`${baseUrl}/dados/estrutura.json`),
    readJson(`${baseUrl}/dados/produtos.json`),
  ]) as [{ marcas: AdminCatalog["brands"]; categorias: AdminCatalog["categories"] }, { produtos: Product[] }];
  const productDraft = localStorage.getItem(productDraftKey);
  const structureDraft = localStorage.getItem(structureDraftKey);
  const activeStructure = structureDraft
    ? JSON.parse(structureDraft) as { marcas: AdminCatalog["brands"]; categorias: Category[] }
    : structure;
  return {
    brands: activeStructure.marcas,
    categories: activeStructure.categorias.map((category) => ({
      ...category,
      subcategorias: category.subcategorias ?? [],
    })),
    products: productDraft ? JSON.parse(productDraft) as Product[] : productFile.produtos,
  };
}

export function saveDraft(products: Product[]) {
  localStorage.setItem(productDraftKey, JSON.stringify(products));
}

export function saveStructureDraft(brands: AdminCatalog["brands"], categories: Category[]) {
  localStorage.setItem(structureDraftKey, JSON.stringify({ versao: 1, marcas: brands, categorias: categories }));
}

export function clearDraft() {
  localStorage.removeItem(productDraftKey);
  localStorage.removeItem(structureDraftKey);
}

export function downloadProducts(products: Product[]) {
  const content = JSON.stringify({ versao: 1, produtos: products }, null, 2);
  const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "produtos.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadStructure(brands: AdminCatalog["brands"], categories: Category[]) {
  const content = JSON.stringify({ versao: 1, marcas: brands, categorias: categories }, null, 2);
  const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "estrutura.json";
  link.click();
  URL.revokeObjectURL(url);
}
