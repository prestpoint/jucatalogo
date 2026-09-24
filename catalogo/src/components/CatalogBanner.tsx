import { Gem, Heart, Truck } from "lucide-react";

export function CatalogBanner() {
  return (
    <section
      className="hero blueprint-banner"
      aria-label="Beleza que cuida de você"
    >
      <div className="banner-block banner-consultant-block">
        <div className="banner-consultant-slot" aria-hidden="true" />
        <div className="banner-benefits-row">
          <div>
            <span className="banner-benefit-icon" aria-hidden="true">
              <Gem />
            </span>
            <p className="banner-field">
              Qualidade
              <br />e confiança
            </p>
          </div>
          <div>
            <span className="banner-benefit-icon" aria-hidden="true">
              <Heart />
            </span>
            <p className="banner-field">
              Atendimento
              <br />
              personalizado
            </p>
          </div>
          <div>
            <span className="banner-benefit-icon" aria-hidden="true">
              <Truck />
            </span>
            <p className="banner-field">
              Entrega rápida
              <br />e segura
            </p>
          </div>
        </div>
      </div>
      <div className="banner-block banner-message-block">
        <h1 className="banner-field banner-title">
          Beleza
          <br />
          <span>que cuida</span>
          <br />
          <span className="banner-title-ending">
            de você!
            <Heart className="banner-title-heart" aria-hidden="true" />
          </span>
        </h1>
        <p className="banner-field banner-description">
          As melhores marcas,
          <br />
          produtos originais e<br />
          pronta entrega, pertinho
          <br />
          de você!
        </p>
      </div>
      <div className="banner-block banner-products-block">
        <img
          className="banner-products-image"
          src="/images/prod_header.png"
          alt="Seleção de produtos Natura, O Boticário e Eudora"
        />
      </div>
      <div className="banner-block banner-brands-block">
        <div className="banner-brand-message">
          <p className="banner-field banner-beauty">
            Beleza
            <br />
            <span>em cada</span>
            <br />
            <span className="banner-beauty-ending">
              detalhe
              <Heart className="banner-beauty-heart" aria-hidden="true" />
            </span>
          </p>
          <p className="banner-field banner-story">
            <span>
              Três marcas
              <br />
              que fazem
              <br />
              parte da sua
              <br />
              história!
            </span>
          </p>
        </div>
        <div className="banner-brand-names">
          <div className="banner-brand-cell">
            <img
              className="banner-brand-logo"
              src="/images/nature.png"
              alt="Natura"
            />
          </div>
          <div className="banner-brand-cell">
            <img
              className="banner-brand-logo"
              src="/images/oboticario.png"
              alt="O Boticário"
            />
          </div>
          <div className="banner-brand-cell">
            <img
              className="banner-brand-logo"
              src="/images/eudora.png"
              alt="Eudora"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
