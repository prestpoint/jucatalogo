import { Heart, Leaf, Search, ShoppingBag, X } from "lucide-react";
import type { RefObject } from "react";
import type { CatalogController } from "../hooks/useCatalogFilters";

export function CatalogHeader({
  catalog,
  searchRef,
  goProducts,
}: {
  catalog: Pick<
    CatalogController,
    | "search"
    | "setSearch"
    | "hasFilters"
    | "reset"
    | "brandList"
    | "brands"
    | "setBrands"
    | "onlyOffers"
    | "setOnlyOffers"
  >;
  searchRef: RefObject<HTMLInputElement | null>;
  goProducts: () => void;
}) {
  const {
    search,
    setSearch,
    hasFilters,
    reset,
    brandList,
    brands,
    setBrands,
    onlyOffers,
    setOnlyOffers,
  } = catalog;
  return (
    <header className="header page-width">
      <button
        className="brand-lockup header-identity"
        onClick={reset}
        aria-label="Beleza que cuida de você, início"
      >
        <span className="header-slogan">
          <span>Beleza</span>
          <span>que cuida</span>
          <span>de você!</span>
          <Heart aria-hidden="true" />
        </span>
        <span className="header-tagline">
          Mais praticidade,
          <br />
          bem-estar e confiança
          <br />
          no seu dia a dia.
        </span>
      </button>
      <div className="header-center">
        <form
          role="search"
          className="search"
          onSubmit={(e) => {
            e.preventDefault();
            goProducts();
          }}
        >
          <Search size={20} />
          <input
            ref={searchRef}
            aria-label="Buscar produtos"
            placeholder="O que você procura hoje?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="icon-button"
              aria-label="Limpar busca"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </form>
        <nav className="top-nav" aria-label="Navegação principal">
          <button className={!hasFilters ? "active" : ""} onClick={reset}>
            Início
          </button>
          {brandList.map((b) => (
            <button
              className={
                brands.length === 1 && brands[0] === b.id ? "active" : ""
              }
              key={b.id}
              onClick={() => {
                reset();
                setBrands([b.id]);
                goProducts();
              }}
            >
              {b.nome}
            </button>
          ))}
          <button
            className={onlyOffers ? "active" : ""}
            onClick={() => {
              reset();
              setOnlyOffers(true);
              goProducts();
            }}
          >
            Ofertas <span className="tiny-dot" />
          </button>
        </nav>
      </div>
      <div className="header-promises">
        <span>
          <Leaf />
          Beleza
          <br />
          de verdade
        </span>
        <span>
          <Heart />
          Atendimento
          <br />
          com carinho
        </span>
        <span>
          <ShoppingBag />
          Seu momento
          <br />
          mais especial
        </span>
      </div>
    </header>
  );
}
