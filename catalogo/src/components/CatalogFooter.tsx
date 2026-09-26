import { Heart, ShieldCheck, Truck } from "lucide-react";

export function CatalogFooter() {
  return <footer className="catalog-footer"><div><ShieldCheck /><span><strong>Produtos originais</strong>e de qualidade</span></div><div className="footer-thanks"><Heart /><span>Obrigada<br />por estar aqui!</span></div><div><Truck /><span><strong>Entrega rápida</strong>para você</span></div></footer>;
}
