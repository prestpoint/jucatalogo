import { useState } from "react";
import type { CatalogData, Product } from "../data";
import { trackWhatsAppClick } from "../services/metrics";

export function useCatalogDialogs(loja: CatalogData["loja"]) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const contact = (item?: Product) => {
    trackWhatsAppClick(item?.id);
    if (!loja.whatsapp) {
      setProduct(null);
      setContactOpen(true);
      return;
    }
    const text = item
      ? `Olá, ${loja.nome}! Gostaria de saber mais sobre ${item.nome} (${item.volume}).`
      : `Olá, ${loja.nome}! Gostaria de uma indicação de produtos.`;
    window.open(
      `https://wa.me/${loja.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return {
    filtersOpen,
    setFiltersOpen,
    product,
    setProduct,
    contactOpen,
    setContactOpen,
    contact,
  };
}
