import { z } from 'zod';

export const imageSchema = z.object({
  src: z.string().min(1), alt: z.string(),
  crop: z.object({ x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(), sourceWidth: z.number().positive() }).optional(),
});

export const productSchema = z.object({
  id: z.string(), nome: z.string(), descricao: z.string(), marcaId: z.string(), categoriaId: z.string(), subcategoriaId: z.string().optional(),
  preco: z.number().nonnegative(), precoAnterior: z.number().nonnegative().optional(), volume: z.string(),
  relevancia: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  destaque: z.boolean().default(false), publicado: z.boolean().default(true), disponivel: z.boolean().default(true), ordem: z.number().default(0),
  imagens: z.array(imageSchema).min(1),
}).transform((product) => {
  // Compatibilidade com os JSONs anteriores; o nível explícito sempre prevalece.
  const relevancia = product.relevancia ?? (product.destaque ? 3 : 1);
  return { ...product, relevancia, destaque: relevancia === 3 };
});
