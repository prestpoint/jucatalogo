const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const maxSize = 8 * 1024 * 1024;

function isAuthorized(request, env) {
  const email = request.headers.get("cf-access-authenticated-user-email")?.toLowerCase();
  const allowed = String(env.ADMIN_EMAILS ?? "").toLowerCase().split(",").map((item) => item.trim()).filter(Boolean);
  return Boolean(email && allowed.includes(email));
}

function safeName(name) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "produto";
}

const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" };

async function availableProductKey(bucket, productName, contentType) {
  const base = safeName(productName);
  const extension = extensions[contentType];
  let suffix = 1;
  while (suffix < 1000) {
    const name = suffix === 1 ? `${base}.${extension}` : `${base}-${suffix}.${extension}`;
    const key = `products/${name}`;
    if (!(await bucket.head(key))) return key;
    suffix += 1;
  }
  throw new Error("Não foi possível gerar um nome disponível para a imagem.");
}

const imageUrl = (key) => `/api/images?key=${encodeURIComponent(key)}`;

async function listAll(bucket) {
  let cursor;
  const images = [];
  do {
    const page = await bucket.list({ prefix: "products/", cursor, limit: 1000, include: ["customMetadata"] });
    images.push(...page.objects.map((object) => ({
      key: object.key,
      name: object.customMetadata?.originalName ?? object.key.split("/").pop(),
      url: imageUrl(object.key),
    })));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return images.reverse();
}

export async function onRequestGet({ env, request }) {
  if (!env.CATALOG_BUCKET) return json({ error: "Bucket R2 não configurado." }, 503);
  const key = new URL(request.url).searchParams.get("key");
  if (key) {
    if (!key.startsWith("products/")) return json({ error: "Imagem inválida." }, 400);
    const object = await env.CATALOG_BUCKET.get(key);
    if (!object) return json({ error: "Imagem não encontrada." }, 404);
    const headers = new Headers({ "cache-control": "public, max-age=86400", etag: object.httpEtag });
    object.writeHttpMetadata(headers);
    return new Response(object.body, { headers });
  }
  if (!isAuthorized(request, env)) return json({ error: "Configure o acesso do painel para visualizar o bucket." }, 401);
  return json({ images: await listAll(env.CATALOG_BUCKET) });
}

export async function onRequestPost({ env, request }) {
  if (!env.CATALOG_BUCKET) return json({ error: "Bucket R2 não configurado." }, 503);
  if (!isAuthorized(request, env)) return json({ error: "Configure o acesso do painel antes de enviar imagens." }, 401);
  const form = await request.formData();
  const file = form.get("file");
  const productName = String(form.get("productName") ?? "").trim();
  if (!(file instanceof File) || !allowedTypes.has(file.type)) return json({ error: "Escolha uma imagem PNG, JPG, WebP ou AVIF." }, 400);
  if (!productName || productName.length > 140) return json({ error: "Informe o nome do produto antes de enviar a imagem." }, 400);
  if (file.size > maxSize) return json({ error: "A imagem deve possuir no máximo 8 MB." }, 400);
  const key = await availableProductKey(env.CATALOG_BUCKET, productName, file.type);
  await env.CATALOG_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=86400" },
    customMetadata: { originalName: file.name },
  });
  return json({ image: { key, name: file.name, url: imageUrl(key) } }, 201);
}
