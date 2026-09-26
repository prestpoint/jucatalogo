type MetricEvent = "visit" | "whatsapp_click";

const visitorKey = "ju-catalogo-visitor-id";
const visitMonthKey = "ju-catalogo-last-visit-month";
const currentMonth = () => new Date().toISOString().slice(0, 7);

function visitorId() {
  const saved = localStorage.getItem(visitorKey);
  if (saved) return saved;
  const created = crypto.randomUUID();
  localStorage.setItem(visitorKey, created);
  return created;
}

function sendMetric(event: MetricEvent, productId?: string) {
  const body = JSON.stringify({ event, month: currentMonth(), visitorId: visitorId(), productId });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/metrics", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/metrics", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => undefined);
}

export function trackMonthlyVisit() {
  const month = currentMonth();
  if (localStorage.getItem(visitMonthKey) === month) return;
  localStorage.setItem(visitMonthKey, month);
  sendMetric("visit");
}

export function trackWhatsAppClick(productId?: string) {
  sendMetric("whatsapp_click", productId);
}
