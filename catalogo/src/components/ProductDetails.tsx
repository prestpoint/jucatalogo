import { WhatsAppIcon } from "./WhatsAppIcon";
import '../product-details.css';
import { RelevanceHeart } from "./RelevanceHeart";
import type { CatalogData, Product } from "../data";
import { money } from "../utils/format";
import { Photo } from "./Photo";
import { Overlay } from "./Overlay";

export function ProductDetails({
  product,
  brandList,
  loja,
  contact,
  onClose,
}: {
  product: Product;
  brandList: CatalogData["marcas"];
  loja: CatalogData["loja"];
  contact: (product: Product) => void;
  onClose: () => void;
}) {
  const brand = brandList.find((b) => b.id === product.marcaId);
  return (
    <Overlay
      title={product.nome}
      className="product-dialog"
      onClose={() => onClose()}
    >
      <div className="modal-product-photo">
        <Photo image={product.imagens[0]} />
      </div>
      <div className="modal-product-info">
        <span className="modal-brand" style={{ color: brand?.cor }}>
          {brand?.nome}
        </span>
        <h2>{product.nome}</h2>
        <p className="product-volume">{product.volume}</p>
        <span className="modal-relevance">
          <RelevanceHeart level={product.relevancia} />
        </span>
        <p>{product.descricao}</p>
        <strong className="modal-price">{money(product.preco)}</strong>
        <button className="primary" onClick={() => contact(product)}>
          <WhatsAppIcon /> Tenho interesse
        </button>
        {loja.demonstracao && (
          <small>
            Produto de demonstração. Informações e preço sujeitos a ajuste.
          </small>
        )}
      </div>
    </Overlay>
  );
}
