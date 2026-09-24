import { ChevronRight, MessageCircle } from "lucide-react";
import { Overlay } from "./Overlay";

export function ContactDialog({ onClose }: { onClose: () => void }) {
  return (
    <Overlay
      title="Contato com a Ju"
      className="contact-dialog"
      onClose={() => onClose()}
    >
      <span className="round-icon">
        <MessageCircle />
      </span>
      <h2>Logo vamos conversar!</h2>
      <p>
        O contato da Ju estará disponível aqui assim que o catálogo estiver
        pronto.
      </p>
      <button className="primary" onClick={() => onClose()}>
        Continuar explorando <ChevronRight size={17} />
      </button>
    </Overlay>
  );
}
