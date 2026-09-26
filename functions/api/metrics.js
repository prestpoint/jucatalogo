const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

const validMonth = (value) => /^\d{4}-\d{2}$/.test(value ?? "") ? value : new Date().toISOString().slice(0, 7);

async function countPrefix(bucket, prefix) {
  let cursor;
  let count = 0;
  do {
    const page = await bucket.list({ prefix, cursor, limit: 1000 });
    count += page.objects.length;
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return count;
}

export async function onRequestGet({ env, request }) {
  if (!env.CATALOG_BUCKET) return json({ error: "R2 não configurado" }, 503);
  const month = validMonth(new URL(request.url).searchParams.get("month"));
  const [visitors, whatsappClicks] = await Promise.all([
    countPrefix(env.CATALOG_BUCKET, `_metrics/${month}/visitors/`),
    countPrefix(env.CATALOG_BUCKET, `_metrics/${month}/whatsapp/`),
  ]);
  return json({ month, visitors, whatsappClicks });
}

export async function onRequestPost({ env, request }) {
  if (!env.CATALOG_BUCKET) return json({ error: "R2 não configurado" }, 503);
  const body = await request.json().catch(() => null);
  const month = validMonth(body?.month);
  if (body?.event === "visit" && typeof body.visitorId === "string" && body.visitorId.length <= 80) {
    await env.CATALOG_BUCKET.put(`_metrics/${month}/visitors/${body.visitorId}`, "");
    return json({ recorded: true }, 201);
  }
  if (body?.event === "whatsapp_click") {
    const id = `${Date.now()}-${crypto.randomUUID()}`;
    await env.CATALOG_BUCKET.put(`_metrics/${month}/whatsapp/${id}`, JSON.stringify({ productId: body.productId ?? null }));
    return json({ recorded: true }, 201);
  }
  return json({ error: "Evento inválido" }, 400);
}
