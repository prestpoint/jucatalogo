import { Search, X } from "lucide-react";
import type { RefObject } from "react";
import type { CatalogController } from "../hooks/useCatalogFilters";

export function CatalogHeader({ catalog, searchRef, goProducts }: {
  catalog: Pick<CatalogController, "search" | "setSearch" | "reset">;
  searchRef: RefObject<HTMLInputElement | null>;
  goProducts: () => void;
}) {
  const { search, setSearch, reset } = catalog;
  return <>
    <header className="catalog-hero page-width">
      <button className="consultant-portrait" onClick={reset} aria-label="Voltar ao início"><img src="/images/consultora.png" alt="Consultora Ju" /></button>
      <div className="hero-copy">
        <div className="hero-copy-title"><h1>Catálogo Online</h1></div>
        <div className="hero-copy-delivery"><strong>Produtos à<br />pronta entrega</strong><span className="hero-rule" /></div>
        <div className="hero-copy-tagline"><p>Suas marcas favoritas,<br />em um só lugar!</p></div>
      </div>
      <div className="hero-brand-column">
        <div className="hero-brands" aria-label="Marcas disponíveis">
          <div><img src="/images/nature.png" alt="Natura" /></div><div><img src="/images/oboticario.png" alt="O Boticário" /></div><div><img src="/images/eudora.png" alt="Eudora" /></div>
        </div>
        <div className="hero-search-wrap"><form role="search" className="catalog-search" onSubmit={(event) => { event.preventDefault(); goProducts(); }}><Search aria-hidden="true" /><input ref={searchRef} aria-label="Buscar produtos" placeholder="Busque seu produto..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" aria-label="Limpar busca" onClick={() => setSearch("")}><X /></button>}</form></div>
      </div>
    </header>
  </>;
}
