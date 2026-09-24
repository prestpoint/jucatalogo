# Ju Catálogo

Projeto de um catálogo de produtos para apresentação aos clientes.

## Estado do projeto

Catálogo público em React, Vite e TypeScript, com dados demonstrativos em JSON.
O painel administrativo ainda será desenvolvido separadamente em `admin/`.

## Desenvolvimento e publicação de teste

- `npm run dev`: inicia o catálogo local (dependências instaladas em `catalogo/`).
- `npm run build`: instala as dependências do catálogo e gera a publicação em `dist/`.
- Antes do build completo no Windows, pare o servidor local para liberar os arquivos das dependências.
- Consulte [PAGES.md](PAGES.md) para criar o projeto Cloudflare Pages pelo GitHub.

A publicação de teste usa a raiz deste repositório, comando `npm run build` e
saída `dist`. Catálogo em `/`; aviso de admin em preparação em `/admin/`.
R2, autenticação e cadastro de produtos ficam para a próxima etapa.

## Repositório

https://github.com/prestpoint/jucatalogo

## Git manual no Windows

Abra o arquivo `.bat` desejado com dois cliques:

| Arquivo | Função |
| --- | --- |
| `commit_projeto.bat` | Salva os arquivos gerais, scripts e configurações, excluindo catálogo e admin. |
| `commit_catalogo.bat` | Salva apenas a pasta `catalogo`. |
| `commit_admin.bat` | Salva apenas a pasta `admin`. |
| `commit_catalogo_admin.bat` | Cria um commit para cada área alterada e faz um único envio. |
| `atualizar_do_git.bat` | Atualiza pela branch `main` do GitHub, exigindo a pasta sem alterações locais. |

Para enviar esta preparação inicial, execute `commit_projeto.bat` e depois `commit_catalogo_admin.bat`. Sugestões de mensagem: `Prepara repositorio e fluxo Git manual` e `Prepara pastas do catalogo e admin`.

Os executáveis pedem a mensagem do commit e enviam ao GitHub. Se o Git ainda não tiver autoria configurada, solicitam nome e e-mail e salvam apenas neste repositório. A autenticação no GitHub é feita pelo próprio Git.

Cada commit inclui somente sua área, mesmo que existam arquivos de outra área previamente preparados. O envio publica **todos os commits locais pendentes da branch `main`**. Se o envio falhar, execute novamente para tentar enviar os commits já criados. Divergências com o GitHub exigem resolução antes de continuar; os scripts não fazem envio forçado nem descartam alterações.

Os arquivos `.bat` utilizam a lógica compartilhada em `scripts/git-manual.ps1`. Exigem Git e Windows PowerShell.

Não incluir senhas, tokens ou dados privados no repositório. Caso a aplicação utilize variáveis de ambiente, documentar os nomes em `.env.example`, sem valores reais.
