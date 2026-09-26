import { useState } from "react";
import { ExternalLink, RotateCcw, Smartphone } from "lucide-react";

const devices = [
  { id: "iphone", name: "iPhone atual", width: 393, height: 852 },
  { id: "android", name: "Android atual", width: 412, height: 915 },
  { id: "compact", name: "Tela compacta", width: 360, height: 800 },
] as const;

export function MobilePreviewPage() {
  const [deviceId, setDeviceId] = useState<(typeof devices)[number]["id"]>("iphone");
  const [reloadKey, setReloadKey] = useState(0);
  const device = devices.find((item) => item.id === deviceId) ?? devices[0];

  return (
    <main className="mobile-preview-page">
      <header className="preview-toolbar">
        <div className="preview-heading">
          <span className="preview-icon"><Smartphone aria-hidden="true" /></span>
          <div>
            <h1>Prévia mobile do catálogo</h1>
            <p>O conteúdo abaixo é carregado diretamente do site local.</p>
          </div>
        </div>

        <div className="preview-actions">
          <label>
            <span>Dispositivo</span>
            <select value={deviceId} onChange={(event) => setDeviceId(event.target.value as typeof deviceId)}>
              {devices.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.width} × {item.height}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => setReloadKey((current) => current + 1)}>
            <RotateCcw aria-hidden="true" /> Atualizar prévia
          </button>
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden="true" /> Abrir catálogo
          </a>
        </div>
      </header>

      <section className="preview-stage" aria-label={`Catálogo em ${device.width} por ${device.height} pixels`}>
        <div className="device-caption">
          <strong>{device.name}</strong>
          <span>{device.width} × {device.height} CSS px</span>
        </div>
        <div
          className="phone-frame"
          style={{
            "--device-width": `${device.width}px`,
            "--device-height": `${device.height}px`,
          } as React.CSSProperties}
        >
          <div className="phone-speaker" aria-hidden="true" />
          <iframe
            key={`${device.id}-${reloadKey}`}
            src={`/?mobilePreview=${device.id}-${reloadKey}`}
            title="Catálogo da Ju em visualização mobile"
            width={device.width}
            height={device.height}
          />
        </div>
      </section>
    </main>
  );
}
