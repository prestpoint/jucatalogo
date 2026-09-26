import React from "react";
import ReactDOM from "react-dom/client";
import { MobilePreviewPage } from "./pages/MobilePreviewPage";
import "./mobile-preview.css";

ReactDOM.createRoot(document.getElementById("mobile-preview-root")!).render(
  <React.StrictMode>
    <MobilePreviewPage />
  </React.StrictMode>,
);
