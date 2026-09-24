import { useRef } from "react";
import { Check } from "lucide-react";
import type { CatalogData } from "../data";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { useCatalogDialogs } from "../hooks/useCatalogDialogs";
import { CatalogHeader } from "../components/CatalogHeader";
import { CatalogBanner } from "../components/CatalogBanner";
import { CatalogFilters } from "../components/CatalogFilters";
import { CatalogResults } from "../components/CatalogResults";
import { CareSidebar } from "../components/CareSidebar";
import { CatalogFooter } from "../components/CatalogFooter";
import { MobileNavigation } from "../components/MobileNavigation";
import { Overlay } from "../components/Overlay";
import { ProductDetails } from "../components/ProductDetails";
import { ContactDialog } from "../components/ContactDialog";

export function CatalogPage({ data }: { data: CatalogData }) {
  const catalog = useCatalogFilters(data);
  const dialogs = useCatalogDialogs(data.loja);
  const searchRef = useRef<HTMLInputElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const goProducts = () =>
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const filters = <CatalogFilters catalog={catalog} produtos={data.produtos} />;

  return (
    <>
      <a className="skip-link" href="#produtos">
        Pular para os produtos
      </a>
      <CatalogHeader
        catalog={catalog}
        searchRef={searchRef}
        goProducts={goProducts}
      />
      <main className="page-width">
        <CatalogBanner />
        <div className="catalog-layout" id="produtos" ref={productsRef}>
          <aside className="filters desktop-filters">{filters}</aside>
          <CatalogResults
            catalog={catalog}
            data={data}
            onOpenFilters={() => dialogs.setFiltersOpen(true)}
            onDetails={dialogs.setProduct}
          />
          <CareSidebar contact={dialogs.contact} />
        </div>
      </main>
      <CatalogFooter />
      <MobileNavigation
        reset={catalog.reset}
        goProducts={goProducts}
        onOpenFilters={() => dialogs.setFiltersOpen(true)}
        onSearch={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          searchRef.current?.focus({ preventScroll: true });
        }}
        contact={dialogs.contact}
      />
      {dialogs.filtersOpen && (
        <Overlay
          title="Filtros e categorias"
          className="filter-dialog"
          onClose={() => dialogs.setFiltersOpen(false)}
        >
          <div className="filters">{filters}</div>
          <button
            className="primary apply-filters"
            onClick={() => {
              dialogs.setFiltersOpen(false);
              goProducts();
            }}
          >
            Mostrar {catalog.visible.length} produtos <Check size={17} />
          </button>
        </Overlay>
      )}
      {dialogs.product && (
        <ProductDetails
          product={dialogs.product}
          brandList={catalog.brandList}
          loja={data.loja}
          contact={dialogs.contact}
          onClose={() => dialogs.setProduct(null)}
        />
      )}
      {dialogs.contactOpen && (
        <ContactDialog onClose={() => dialogs.setContactOpen(false)} />
      )}
    </>
  );
}
