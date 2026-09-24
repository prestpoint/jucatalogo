import { Menu, MessageCircle, Search, ShoppingBag } from "lucide-react";

export function MobileNavigation({
  reset,
  goProducts,
  onOpenFilters,
  onSearch,
  contact,
}: {
  reset: () => void;
  goProducts: () => void;
  onOpenFilters: () => void;
  onSearch: () => void;
  contact: () => void;
}) {
  return (
    <nav className="mobile-nav" aria-label="Atalhos">
      <button
        onClick={() => {
          reset();
          goProducts();
        }}
      >
        <ShoppingBag size={20} />
        <span>Catálogo</span>
      </button>
      <button onClick={() => onOpenFilters()}>
        <Menu size={20} />
        <span>Categorias</span>
      </button>
      <button
        onClick={() => {
          onSearch();
        }}
      >
        <Search size={20} />
        <span>Buscar</span>
      </button>
      <button onClick={() => contact()}>
        <MessageCircle size={20} />
        <span>Fale com a Ju</span>
      </button>
    </nav>
  );
}
