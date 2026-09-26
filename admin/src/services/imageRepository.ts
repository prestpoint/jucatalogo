export type BucketImage = { key: string; name: string; url: string };

async function readResponse(response: Response) {
  const data = await response.json().catch(() => null) as { error?: string } | null;
  if (!data) throw new Error("O serviço de imagens ainda não está disponível neste ambiente.");
  if (!response.ok) throw new Error(data?.error ?? "Não foi possível acessar as imagens do bucket.");
  return data;
}

export async function listBucketImages(): Promise<BucketImage[]> {
  const response = await fetch("/api/images", { cache: "no-cache" });
  const data = await readResponse(response) as { images?: BucketImage[] };
  return data.images ?? [];
}

export async function uploadProductImage(file: File, productName: string): Promise<BucketImage> {
  const form = new FormData();
  form.append("file", file);
  form.append("productName", productName);
  const response = await fetch("/api/images", { method: "POST", body: form });
  const data = await readResponse(response) as { image?: BucketImage };
  if (!data.image) throw new Error("O bucket não retornou a imagem enviada.");
  return data.image;
}
