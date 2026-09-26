import { useEffect, useState } from "react";

export type MobileScrollMode = "products" | "page";

export function useMobileScrollMode() {
  const [mode, setMode] = useState<MobileScrollMode>("products");

  useEffect(() => {
    document.documentElement.dataset.mobileScroll = mode;

    return () => {
      delete document.documentElement.dataset.mobileScroll;
    };
  }, [mode]);

  const toggle = () => {
    window.scrollTo({ top: 0 });
    setMode((current) => current === "products" ? "page" : "products");
  };

  return { mode, toggle };
}
