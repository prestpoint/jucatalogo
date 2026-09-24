import { Heart } from "lucide-react";

export function CatalogLoading({
  error,
  onRetry,
}: {
  error: boolean;
  onRetry: () => void;
}) {
  return (
    <main className="initial-state">
      <Heart size={38} />
      <h1>Beleza que cuida de você</h1>
      {error ? (
        <>
          <p>
            Não foi possível carregar o catálogo. Tente novamente em instantes.
          </p>
          <button className="primary" onClick={onRetry}>
            Tentar novamente
          </button>
        </>
      ) : (
        <p role="status">Preparando um momento de beleza para você…</p>
      )}
    </main>
  );
}
