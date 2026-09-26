import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

// Executa os módulos reais sem depender de um navegador ou de dados de produção.
const temporary = await mkdtemp(join(tmpdir(), 'ju-catalog-tests-'));
after(() => rm(temporary, { recursive: true, force: true }));
for (const [source, output] of [
  ['../src/utils/format.ts', 'format.mjs'],
  ['../src/catalog/selectCatalog.ts', 'selectCatalog.mjs'],
  ['../src/schemas/product.ts', 'product.mjs'],
]) {
  const sourceText = await readFile(new URL(source, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(sourceText, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  }).outputText.replace(/(['"])\.\.\/utils\/format\1/g, '"./format.mjs"')
    .replace(/(['"])zod\1/g, JSON.stringify(import.meta.resolve('zod')));
  await writeFile(join(temporary, output), compiled);
}
const { selectCatalog } = await import(pathToFileURL(join(temporary, 'selectCatalog.mjs')));
const { productSchema } = await import(pathToFileURL(join(temporary, 'product.mjs')));
const { truncateText, truncateTextToLines } = await import(pathToFileURL(join(temporary, 'format.mjs')));

const defaults = {
  search: '', category: '', subcategory: '', brands: [],
  onlyHighlights: false, onlyOffers: false, sort: 'relevance',
};
const product = (id, fields) => ({
  id, nome: id, descricao: 'Descrição', marcaId: 'natura', categoriaId: 'perfumes',
  preco: 100, ordem: 0, destaque: false, relevancia: 1, ...fields,
});
const data = {
  marcas: [
    { id: 'boticario', nome: 'O Boticário', ordem: 2 },
    { id: 'natura', nome: 'Natura', ordem: 1 },
  ],
  categorias: [
    { id: 'perfumes', nome: 'Perfumes', ativo: true, ordem: 1, subcategorias: [
      { id: 'feminino', nome: 'Feminino', ativo: true, ordem: 1 },
      { id: 'oculta', nome: 'Oculta', ativo: false, ordem: 0 },
    ] },
    { id: 'corpo', nome: 'Corpo', ativo: true, ordem: 2, subcategorias: [] },
    { id: 'inativa', ativo: false, ordem: 0, subcategorias: [] },
  ],
  produtos: [
    product('c', { nome: 'Óleo corporal', categoriaId: 'corpo', preco: 50, precoAnterior: 50, ordem: 3 }),
    product('a', { nome: 'Água floral', subcategoriaId: 'feminino', preco: 80, precoAnterior: 100, destaque: true, relevancia: 3, ordem: 1 }),
    product('b', { nome: 'Malbec', marcaId: 'boticario', descricao: 'Colônia amadeirada', preco: 120, precoAnterior: 110, ordem: 2 }),
  ],
};
const select = (filters = {}) => selectCatalog(data, { ...defaults, ...filters });
const ids = (filters) => select(filters).visible.map(p => p.id);

test('busca ignora acentos, caixa e espaços nas extremidades', () => {
  assert.deepEqual(ids({ search: '  AGUA  ' }), ['a']);
  assert.deepEqual(ids({ search: 'colonia' }), ['b']);
  assert.deepEqual(ids({ search: 'boticario' }), ['b']);
  assert.deepEqual(ids({ search: 'inexistente' }), []);
});
test('nome do card é cortado antes da renderização e recebe reticências', () => {
  assert.equal(truncateText('Siàge Reconstrói os Fios', 21), 'Siàge Reconstrói os…');
  assert.equal(truncateText('Una Blush', 21), 'Una Blush');
  assert.equal(truncateTextToLines('12345 12345 12345', 10, 2, text => text.length), '12345 12345 123…');
});
test('combina categoria, subcategoria, marca e destaque', () => {
  assert.deepEqual(ids({ category: 'perfumes', subcategory: 'feminino', brands: ['natura'], onlyHighlights: true }), ['a']);
  assert.deepEqual(ids({ category: 'corpo', brands: ['boticario'] }), []);
  assert.deepEqual(ids({ brands: ['natura', 'boticario'] }), ['a', 'b', 'c']);
});
test('ofertas exigem preço anterior maior que o atual', () => {
  assert.deepEqual(ids({ onlyOffers: true }), ['a']);
});
test('ordena por relevância, preço e nome sem alterar os dados originais', () => {
  const before = structuredClone(data);
  assert.deepEqual(ids({ sort: 'relevance' }), ['a', 'b', 'c']);
  assert.deepEqual(ids({ sort: 'price-asc' }), ['c', 'a', 'b']);
  assert.deepEqual(ids({ sort: 'price-desc' }), ['b', 'a', 'c']);
  assert.deepEqual(ids({ sort: 'name' }), ['a', 'b', 'c']);
  assert.deepEqual(data, before);
});
test('deriva categorias ativas, seleção e indicadores dos filtros', () => {
  const result = select({ category: 'perfumes', subcategory: 'feminino', brands: ['natura'], onlyOffers: true });
  assert.deepEqual(result.categories.map(c => c.id), ['perfumes', 'corpo']);
  assert.deepEqual(result.activeSubs.map(s => s.id), ['feminino']);
  assert.equal(result.selectedSub.nome, 'Feminino');
  assert.equal(result.activeCount, 3);
  assert.equal(result.hasFilters, true);
  assert.equal(select().hasFilters, false);
});

test('relevância ordena 3, 2, 1 e desempata por ordem, inclusive após filtrar', () => {
  const ranked = { ...data, produtos: [
    product('baixo', { relevancia: 1, ordem: 0 }),
    product('medio', { relevancia: 2, ordem: 1 }),
    product('alto-b', { relevancia: 3, ordem: 20 }),
    product('alto-a', { relevancia: 3, ordem: 10 }),
  ] };
  assert.deepEqual(selectCatalog(ranked, { ...defaults, brands: ['natura'] }).visible.map(p => p.id), ['alto-a', 'alto-b', 'medio', 'baixo']);
});

test('contrato aceita somente os três níveis e converte o destaque antigo', () => {
  const input = { ...data.produtos[0], volume: '100 ml', imagens: [{ src: '/foto.png', alt: 'Produto' }] };
  for (const level of [1, 2, 3]) {
    assert.equal(productSchema.parse({ ...input, relevancia: level }).relevancia, level);
  }
  for (const invalid of [0, 4, 1.5, '3', null]) {
    assert.equal(productSchema.safeParse({ ...input, relevancia: invalid }).success, false);
  }
  assert.equal(productSchema.parse({ ...input, relevancia: undefined, destaque: true }).relevancia, 3);
  assert.equal(productSchema.parse({ ...input, relevancia: undefined, destaque: false }).relevancia, 1);
  assert.equal(productSchema.parse({ ...input, relevancia: 2, destaque: true }).destaque, false);
});
