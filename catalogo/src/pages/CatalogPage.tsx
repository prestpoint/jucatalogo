import { useEffect, useLayoutEffect, useRef } from "react";
import type { CatalogData } from "../data";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { useCatalogDialogs } from "../hooks/useCatalogDialogs";
import { CatalogHeader } from "../components/CatalogHeader";
import { CatalogFilters } from "../components/CatalogFilters";
import { CatalogResults } from "../components/CatalogResults";
import { CatalogFooter } from "../components/CatalogFooter";
import { Overlay } from "../components/Overlay";
import { ProductDetails } from "../components/ProductDetails";
import { ContactDialog } from "../components/ContactDialog";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { trackMonthlyVisit } from "../services/metrics";

export function CatalogPage({ data }: { data: CatalogData }) {
  const catalog = useCatalogFilters(data);
  const dialogs = useCatalogDialogs(data.loja);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const searchRef = useRef<HTMLInputElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  useEffect(() => trackMonthlyVisit(), []);
  useLayoutEffect(() => {
    productsRef.current?.scrollTo({ top: 0 });
  }, []);
  const goProducts = () => {
    if (isMobile) {
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    productsRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };
  const filters = <CatalogFilters catalog={catalog} produtos={data.produtos} />;
  return <>
    <a className="skip-link" href="#produtos">Pular para os produtos</a>
    <CatalogHeader catalog={catalog} searchRef={searchRef} goProducts={goProducts} />
    <main className="catalog-main page-width" id="produtos" ref={productsRef}>
      <div className="catalog-layout"><aside className="catalog-sidebar filters">{filters}</aside><CatalogResults catalog={catalog} data={data} onOpenFilters={() => dialogs.setFiltersOpen(true)} onDetails={dialogs.setProduct} /></div>
      <CatalogFooter />
    </main>
    {dialogs.filtersOpen && <Overlay title="Filtros e categorias" className="filter-dialog" onClose={() => dialogs.setFiltersOpen(false)}><div className="filters"><CatalogFilters catalog={catalog} produtos={data.produtos} onCategorySelected={() => { dialogs.setFiltersOpen(false); goProducts(); }} /></div></Overlay>}
    {dialogs.product && <ProductDetails product={dialogs.product} brandList={catalog.brandList} loja={data.loja} contact={dialogs.contact} onClose={() => dialogs.setProduct(null)} />}
    {dialogs.contactOpen && <ContactDialog onClose={() => dialogs.setContactOpen(false)} />}
  </>;
}
