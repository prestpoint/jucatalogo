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
- `/admin/`: apenas um aviso de painel em preparação; não há login ou cadastro.
- Endereços inexistentes: página 404, sem abrir o catálogo como se fosse o admin.

O build instala as dependências do catálogo pelo seu lockfile, compila a aplicação
e reúne os arquivos em `dist/`. Somente essa pasta é publicada; o código-fonte e
as instruções do projeto não fazem parte do site. `dist/` não deve ser commitada.

Foram incluídas instruções de não indexação para buscadores. Elas não restringem
acesso: o endereço de teste é público. Os dados e preços continuam demonstrativos.

## Preparar localmente

Na raiz do repositório:

```powershell
npm run build
```

Esse comando gera a publicação localmente, sem executar Git nem deploy.
Depois de enviar manualmente as alterações de `catalogo/` e os arquivos gerais
ao GitHub, crie o projeto Pages com a configuração acima.

## Próxima etapa

O admin continuará em `admin/`. Quando implementado, seu build substituirá o aviso
em `dist/admin/` e terá base `/admin/`. Autenticação, API de gravação e vínculo com
um bucket R2 próprio serão configurados nessa etapa. Até lá, alterações nos JSONs
exigem uma nova publicação pelo Git.

Referências:
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/configuration/serving-pages/
