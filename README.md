# Ju Catálogo

Projeto de um catálogo de produtos para apresentação aos clientes.

## Estado do projeto

Preparação inicial do repositório. As funcionalidades, a identidade visual e a tecnologia serão definidas no alinhamento do produto.

## Repositório

https://github.com/prestpoint/jucatalogo

## Pontos a definir

- Nome da marca e tipos de produtos.
- Informações de cada produto: fotos, descrição, preço e variações.
- Organização por categorias.
- Forma de contato ou pedido dos clientes.
- Forma de cadastro e atualização dos produtos.

## Desenvolvimento

Ainda não há aplicação ou comandos de execução configurados.

As duas áreas serão organizadas em `catalogo/` (página dos clientes) e `admin/` (gestão de produtos com acesso restrito).

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
