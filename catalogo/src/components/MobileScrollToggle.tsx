import { PanelTopOpen, Rows3 } from "lucide-react";
import type { MobileScrollMode } from "../hooks/useMobileScrollMode";

export function MobileScrollToggle({ mode, onToggle }: {
  mode: MobileScrollMode;
  onToggle: () => void;
}) {
  const pageScrollEnabled = mode === "page";
  const label = pageScrollEnabled
    ? "Usar rolagem apenas nos produtos"
    : "Usar rolagem do site inteiro";

  return (
    <button
      className={`mobile-scroll-toggle${pageScrollEnabled ? " page-scroll-enabled" : ""}`}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pageScrollEnabled}
      onClick={onToggle}
    >
      {pageScrollEnabled ? <Rows3 aria-hidden="true" /> : <PanelTopOpen aria-hidden="true" />}
    </button>
  );
}
