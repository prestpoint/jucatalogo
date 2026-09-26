import { Bell, Download, RotateCcw } from "lucide-react";

export function AdminHeader({ title, subtitle, onExport, onRestore }: {
  title: string;
  subtitle: string;
  onExport: () => void;
  onRestore: () => void;
}) {
  return <header className="admin-header">
    <div><p>{subtitle}</p><h1>{title}</h1></div>
    <div className="header-actions">
      <button className="icon-action" aria-label="Restaurar dados originais" title="Restaurar dados originais" onClick={onRestore}><RotateCcw /></button>
      <button className="export-action" onClick={onExport}><Download /><span>Baixar JSON</span></button>
      <button className="icon-action notification" aria-label="Notificações"><Bell /><i /></button>
      <span className="admin-avatar">JU</span>
    </div>
  </header>;
}
