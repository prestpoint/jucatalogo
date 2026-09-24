# Catálogo da Ju

Base responsiva em React, Vite e TypeScript. Os dados são lidos dos JSONs em tempo de execução.

## Executar localmente

Com Node.js 22.12 ou superior compatível, abrir um terminal nesta pasta:

```powershell
npm install
npm run dev
```

Abrir o endereço informado. `npm run build` verifica o TypeScript e gera a versão de publicação em `dist/`.

## Modelo dos dados

- `public/dados/loja.json`: nome, texto do banner, modo demonstrativo e WhatsApp. O número fica nulo até ser informado.
- `public/dados/estrutura.json`: marcas, categorias e subcategorias opcionais, com IDs, ordenação e visibilidade.
- `public/dados/produtos.json`: produtos, preços, fotos, disponibilidade, publicação e destaque.
- `src/data.ts`: validação do formato e dos vínculos com Zod.

O coração representa `destaque`, definido pela administradora. Não é um botão de favoritos. Categorias com subcategorias expandem suas opções automaticamente; sem subcategorias, filtram diretamente. “Ver detalhes” abre um modal básico.

Imagens individuais fornecidas em `src/imagens` foram copiadas para `public/images` e são referenciadas pelos JSONs. Preços e descrições são demonstrativos. As fotos devem ser otimizadas antes da publicação final. O banner ainda usa imagens fixas nesta primeira base visual.

## Cloudflare (etapa futura)

Pages: diretório raiz `catalogo`, comando `npm run build`, saída `dist`. Nenhum deploy foi realizado.

`VITE_DATA_BASE_URL` permite alterar a origem dos três JSONs, mantendo o mesmo contrato. Quando vazio, usa `/dados`. Em uma origem R2 diferente, será necessário permitir CORS. Os caminhos das fotos podem ser URLs públicas do R2. Nunca incluir credenciais em variáveis `VITE_*`, pois são públicas.

Admin, autenticação e gravação via Pages Functions serão desenvolvidos após aprovação do catálogo. A estratégia de publicação e cache será definida nessa etapa.

## Git manual

Executar `commit_catalogo.bat` na raiz. Mensagem sugerida: `Cria base responsiva do catalogo com JSON e modal de produtos`.
