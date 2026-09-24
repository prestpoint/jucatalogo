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

O coração representa `relevancia`, definida pela administradora. Não é um botão de favoritos. Categorias com subcategorias expandem suas opções automaticamente; sem subcategorias, filtram diretamente. “Ver detalhes” abre um modal básico.

### Relevância: contrato para o futuro admin

Cada produto deve conter `"relevancia": 1`, `2` ou `3` (número inteiro):

| Nível | Cor do coração | Prioridade |
|---|---|---|
| 1 | Nude `#FAF6F2` | Normal |
| 2 | Rosa suave `#EBC9C1` | Intermediária |
| 3 | Rosa principal `#D98293` | Maior |

O admin deverá salvar o número, não a cor. A paleta é centralizada em
`src/catalog/relevance.ts`. Todos os cards mostram o coração preenchido apenas
com a cor do nível, sem contorno, e com identificação textual acessível.

“Mais relevantes” ordena do nível 3 ao 1, usando `ordem` crescente para desempate.
Pesquisa, categorias e marcas preservam essa ordenação. Nome e preço continuam
com suas ordenações próprias. O filtro interno de destaques seleciona o nível 3.

`src/schemas/product.ts` valida e normaliza o JSON durante o carregamento.
Para arquivos antigos sem `relevancia`, `destaque: true` vira nível 3 e os demais
viram nível 1. Um nível explícito prevalece sobre `destaque`; valores inválidos
são rejeitados. Novos JSONs devem enviar `relevancia` e podem omitir `destaque`.
O painel de administração ainda será implementado.

Imagens individuais fornecidas em `src/imagens` foram copiadas para `public/images` e são referenciadas pelos JSONs. Preços e descrições são demonstrativos. As fotos devem ser otimizadas antes da publicação final. O banner ainda usa imagens fixas nesta primeira base visual.

## Cloudflare (etapa futura)

Pages: diretório raiz `catalogo`, comando `npm run build`, saída `dist`. Nenhum deploy foi realizado.

`VITE_DATA_BASE_URL` permite alterar a origem dos três JSONs, mantendo o mesmo contrato. Quando vazio, usa `/dados`. Em uma origem R2 diferente, será necessário permitir CORS. Os caminhos das fotos podem ser URLs públicas do R2. Nunca incluir credenciais em variáveis `VITE_*`, pois são públicas.

Admin, autenticação e gravação via Pages Functions serão desenvolvidos após aprovação do catálogo. A estratégia de publicação e cache será definida nessa etapa.

## Git manual

Executar `commit_catalogo.bat` na raiz. Mensagem sugerida: `Cria base responsiva do catalogo com JSON e modal de produtos`.
