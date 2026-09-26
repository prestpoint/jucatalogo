import { BadgeDollarSign, Boxes, CircleOff, Eye, MessageCircle, Users } from "lucide-react";
import type { AdminCatalog } from "../types";
import type { CatalogMetrics } from "../services/metricsRepository";

export function DashboardOverview({ catalog, metrics }: { catalog: AdminCatalog; metrics: CatalogMetrics }) {
  const published = catalog.products.filter((product) => product.publicado).length;
  const unavailable = catalog.products.filter((product) => !product.disponivel).length;
  const average = catalog.products.reduce((sum, product) => sum + product.preco, 0) / Math.max(1, catalog.products.length);
  const stats = [
    { label: "Produtos", value: catalog.products.length, note: "cadastrados", icon: Boxes, tone: "rose" },
    { label: "Publicados", value: published, note: "visíveis no catálogo", icon: Eye, tone: "green" },
    { label: "Indisponíveis", value: unavailable, note: "pedem atenção", icon: CircleOff, tone: "orange" },
    { label: "Preço médio", value: average.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), note: "entre os produtos", icon: BadgeDollarSign, tone: "purple" },
    { label: "Visitantes do mês", value: metrics.available ? metrics.visitors.toLocaleString("pt-BR") : "—", note: metrics.available ? "pessoas únicas" : "aguardando conexão", icon: Users, tone: "blue" },
    { label: "Cliques no WhatsApp", value: metrics.available ? metrics.whatsappClicks.toLocaleString("pt-BR") : "—", note: metrics.available ? "neste mês" : "aguardando conexão", icon: MessageCircle, tone: "whatsapp" },
  ];
  return <section className="overview-section">
    <div className="section-heading"><div><span>Resumo</span><h2>Seu catálogo hoje</h2></div></div>
    <div className="stats-grid">{stats.map(({ label, value, note, icon: Icon, tone }) => <article key={label} className={`stat-card ${tone}`}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{note}</p></div></article>)}</div>
    <article className="readiness-card"><div><span>Próxima etapa</span><h2>Preparado para integração</h2><p>O painel já trabalha com o contrato atual de produtos. A autenticação e a gravação no R2 entrarão pela camada de serviços.</p></div><strong>Base local</strong></article>
  </section>;
}
