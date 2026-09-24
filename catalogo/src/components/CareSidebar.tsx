import { WhatsAppIcon } from './WhatsAppIcon';
import {
  ArrowRight,
  Gem,
  Heart,
  Headphones,
  Truck,
} from "lucide-react";
import '../quote-card.css';

export function CareSidebar({ contact }: { contact: () => void }) {
  return (
    <aside className="care-sidebar">
      <div className="consultant-card">
        <span className="round-icon">
          <WhatsAppIcon size={32} />
        </span>
        <h2>Fale com a consultora!</h2>
        <p>
          Tire suas dúvidas, conheça as novidades e receba recomendações
          personalizadas.
        </p>
        <button className="primary" onClick={() => contact()}>
          Chamar no WhatsApp <ArrowRight size={17} />
        </button>
      </div>
      <div className="benefits">
        {[
          {
            Icon: Heart,
            title: "Atendimento personalizado",
            text: "Indicação certa para você",
          },
          {
            Icon: Gem,
            title: "Produtos originais",
            text: "Qualidade e confiança das melhores marcas",
          },
          {
            Icon: Truck,
            title: "Entrega rápida",
            text: "O que você ama, mais rápido",
          },
          {
            Icon: Headphones,
            title: "Suporte sempre",
            text: "Conte comigo em cada momento",
          },
        ].map(({ Icon, title, text }) => (
          <div key={title}>
            <span className="round-icon">
              <Icon />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="quote-card">
        <div className="quote-card-message">
          <Heart aria-hidden="true" />
          <p>Beleza faz<br />histórias reais</p>
        </div>
      </div>
    </aside>
  );
}
