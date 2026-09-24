import { z } from 'zod';

const imageSchema = z.object({
  src: z.string().min(1), alt: z.string(),
  // Recorte visual temporário das referências. Fotos reais precisam apenas de src e alt.
  crop: z.object({ x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(), sourceWidth: z.number().positive() }).optional(),
});
const categorySchema = z.object({
  id: z.string(), nome: z.string(), icone: z.string().default('grid'), ordem: z.number().default(0), ativo: z.boolean().default(true),
  subcategorias: z.array(z.object({ id: z.string(), nome: z.string(), ordem: z.number().default(0), ativo: z.boolean().default(true) })).default([]),
});
const productSchema = z.object({
  id: z.string(), nome: z.string(), descricao: z.string(), marcaId: z.string(), categoriaId: z.string(), subcategoriaId: z.string().optional(),
  preco: z.number().nonnegative(), precoAnterior: z.number().nonnegative().optional(), volume: z.string(),
  destaque: z.boolean().default(false), publicado: z.boolean().default(true), disponivel: z.boolean().default(true), ordem: z.number().default(0),
  imagens: z.array(imageSchema).min(1),
});
const structureSchema = z.object({
  versao: z.literal(1),
  marcas: z.array(z.object({ id: z.string(), nome: z.string(), cor: z.string().regex(/^#[0-9a-fA-F]{6}$/), ordem: z.number().default(0) })),
  categorias: z.array(categorySchema),
});
const settingsSchema = z.object({
  versao: z.literal(1), nome: z.string(), slogan: z.string(), demonstracao: z.boolean(), whatsapp: z.string().regex(/^\d{10,15}$/).nullable(),
  banner: z.object({ titulo: z.string(), texto: z.string(), chamada: z.string() }),
});
export type Product = z.infer<typeof productSchema>;
export type ProductImage = z.infer<typeof imageSchema>;
export type Category = z.infer<typeof categorySchema>;
export type CatalogData = z.infer<typeof structureSchema> & { produtos: Product[]; loja: z.infer<typeof settingsSchema> };

const base = (import.meta.env.VITE_DATA_BASE_URL || '/dados').replace(/\/$/, '');
async function read(name: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(`${base}/${name}.json`, { signal, cache: 'no-cache' });
  if (!response.ok) throw new Error(`Não foi possível carregar ${name}.`);
  return response.json();
}
export async function loadCatalog(signal: AbortSignal): Promise<CatalogData> {
  const [structure, products, settings] = await Promise.all(['estrutura', 'produtos', 'loja'].map(name => read(name, signal)));
  const parsed = structureSchema.parse(structure);
  const all = z.object({ versao: z.literal(1), produtos: z.array(productSchema) }).parse(products).produtos;
  for (const product of all) {
    const category = parsed.categorias.find(c => c.id === product.categoriaId);
    if (!category || !parsed.marcas.some(b => b.id === product.marcaId) || (product.subcategoriaId && !category.subcategorias.some(s => s.id === product.subcategoriaId))) {
      throw new Error('Os vínculos de um produto são inválidos.');
    }
  }
  const ids = [parsed.marcas.map(x => x.id), parsed.categorias.map(x => x.id), all.map(x => x.id), ...parsed.categorias.map(x => x.subcategorias.map(s => s.id))];
  if (ids.some(group => new Set(group).size !== group.length)) throw new Error('Existem identificadores repetidos.');
  return { ...parsed, loja: settingsSchema.parse(settings), produtos: all.filter(p => {
    const category = parsed.categorias.find(c => c.id === p.categoriaId)!;
    return p.publicado && category.ativo && (!p.subcategoriaId || category.subcategorias.some(s => s.id === p.subcategoriaId && s.ativo));
  }) };
}
export const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
