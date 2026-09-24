import { cp, mkdir, rm, lstat, access } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const catalog = resolve(root, 'catalogo', 'dist');
const pages = resolve(root, 'scripts', 'pages');

// Apenas a saída gerada deste projeto pode ser substituída; recusa links externos.
if (dirname(output) !== root || output !== join(root, 'dist')) {
  throw new Error('Diretório de publicação inválido.');
}
const existing = await lstat(output).catch(error => {
  if (error.code !== 'ENOENT') throw error;
  return null;
});
if (existing?.isSymbolicLink()) throw new Error('dist não pode ser um link simbólico.');
await access(join(catalog, 'index.html'));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(catalog, output, { recursive: true });
await cp(pages, output, { recursive: true });
console.log('Publicação de teste pronta em dist/ (catálogo e aviso em /admin/).');
