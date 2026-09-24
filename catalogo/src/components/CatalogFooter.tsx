import { Heart, Leaf, ShieldCheck, Truck } from "lucide-react";

export function CatalogFooter() {
  return (
    <footer className="catalog-footer">
      <div className="footer-brands" aria-label="Marcas do catálogo">
        <div>
          <img src="/images/nature.png" alt="Natura" />
        </div>
        <div>
          <img src="/images/oboticario.png" alt="O Boticário" />
        </div>
        <div>
          <img src="/images/eudora.png" alt="Eudora" />
        </div>
      </div>
      <div className="footer-message">
        Beleza que transforma o seu dia <Heart aria-hidden="true" />
      </div>
      <div className="footer-promises">
        <div>
          <Leaf aria-hidden="true" />
          <span>
            Beleza
            <br />
            de verdade
          </span>
        </div>
        <div>
          <Heart aria-hidden="true" />
          <span>
            Atendimento
            <br />
            com carinho
          </span>
        </div>
        <div>
          <Truck aria-hidden="true" />
          <span>Entrega rápida</span>
        </div>
        <div>
          <ShieldCheck aria-hidden="true" />
          <span>Produtos originais</span>
        </div>
      </div>
    </footer>
  );
}
