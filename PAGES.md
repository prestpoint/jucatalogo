# Publicação de teste no Cloudflare Pages

O catálogo e seus JSONs demonstrativos são publicados juntos. Não é necessário
configurar R2, banco de dados, Functions ou credenciais nesta etapa.

## Criar pelo Git

Em Workers & Pages, escolha criar um projeto **Pages**, conecte o GitHub e
selecione `prestpoint/jucatalogo`. Configure:

| Campo | Valor |
| --- | --- |
| Nome sugerido | `ju-catalogo-teste` (se disponível) |
| Branch de produção | `main` |
| Framework preset | `None` |
| Root directory | Deixar vazio: raiz do repositório |
| Build command | `npm run build` |
| Build output directory | `dist` |

A versão do Node é definida em `.node-version`. Não definir `VITE_DATA_BASE_URL`
nesta fase: o catálogo usa `/dados`, no próprio domínio. Caso exista uma variável
antiga com esse nome no projeto Pages, removê-la antes da publicação.

Após o primeiro build, o endereço fornecido pelo Pages (`*.pages.dev`) já permite
visualizar o catálogo. Não é necessário configurar um domínio próprio.
O termo “produção” acima é o nome do campo do Cloudflare; este projeto será usado
como ambiente de teste. Novos envios à branch configurada disparam publicação
automática pela integração Git.

## Resultado

- `/`: catálogo funcional com os produtos demonstrativos.
- `/dados/*.json`: dados atuais, incluídos na publicação.
- `/admin/`: painel administrativo mobile-first para validação da estrutura.
- Endereços inexistentes: página 404, sem abrir o catálogo como se fosse o admin.

O build instala as dependências do catálogo e do painel pelos respectivos
lockfiles, compila as duas aplicações e reúne os arquivos em `dist/`. Somente
essa pasta é publicada; o código-fonte e as instruções do projeto não fazem parte
do site. `dist/` não deve ser commitada.

Foram incluídas instruções de não indexação para buscadores. Elas não restringem
acesso: o endereço de teste é público. Os dados e preços continuam demonstrativos.

## Métricas do catálogo

As métricas de visitantes mensais e cliques no WhatsApp usam a Function
`/api/metrics`. Para ativá-las no Pages, vincule o bucket R2 do catálogo com o
nome de variável `CATALOG_BUCKET`. Sem esse vínculo, o painel mostra “aguardando
conexão” e não inventa contagens locais.

O upload e a listagem de imagens também usam `CATALOG_BUCKET`. Essas operações
exigem que `/admin/*` e a listagem da API estejam protegidos pelo Cloudflare
Access. Configure `ADMIN_EMAILS` como uma lista, separada por vírgulas, dos
e-mails autorizados; a Function valida o cabeçalho de identidade fornecido pelo
Access antes de aceitar gravações.

Os eventos ficam no prefixo `_metrics/` do bucket. Visitantes são identificados
por um código aleatório guardado no navegador e contado uma vez por mês; nenhum
dado pessoal é gravado nesse registro.

## Preparar localmente

Na raiz do repositório:

```powershell
npm run build
```

Esse comando gera a publicação localmente, sem executar Git nem deploy.
Depois de enviar manualmente as alterações de `catalogo/` e os arquivos gerais
ao GitHub, crie o projeto Pages com a configuração acima.

## Próxima etapa

O painel já é publicado em `/admin/`, ainda sem autenticação. A API de gravação e
o vínculo definitivo com o bucket R2 serão configurados antes do uso real. Até
lá, alterações nos JSONs exigem uma nova publicação pelo Git.

Referências:
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/configuration/serving-pages/
