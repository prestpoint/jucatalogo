# Organização do catálogo

- `App.tsx`: carrega os dados e exibe o estado inicial ou a página.
- `pages/CatalogPage.tsx`: reúne cabeçalho, busca, grade, rodapé e conecta os controles às janelas.
- `components/`: apresentação com propriedades tipadas. `ProductCard` é o único modelo de card; `Photo` e `Overlay` são elementos compartilhados.
- `hooks/useCatalogData.ts`: carregamento, cancelamento e nova tentativa.
- `hooks/useCatalogFilters.ts`: estado da pesquisa, filtros, ordenação e limpeza.
- `hooks/useCatalogDialogs.ts`: abertura das janelas e contato com a consultora.
- `catalog/selectCatalog.ts`: seleção e ordenação puras, sem DOM ou estado React.
- `data.ts`: leitura e validação do contrato de dados do catálogo.
- `utils/format.ts`: preços e normalização de texto.

Os componentes recebem produtos e marcas já validados. A cor da marca e os
textos do card vêm dos dados, enquanto a hierarquia visual fica no CSS.
O admin continua separado; esta organização não implementa seu cadastro nem
altera o contrato atual dos arquivos JSON.

Para novas funcionalidades, altere o módulo responsável e mantenha o App pequeno.
Extraia componentes por responsabilidade, evitando duplicar estruturas ou criar
abstrações para cada elemento HTML. Preserve acessibilidade, classes e estrutura
do DOM quando a tarefa não pedir mudança visual.

`catalog-v2.css` contém a composição visual atual: cabeçalho editorial, busca,
categorias laterais, seletor de marcas, grade responsiva e rodapé. Em telas
menores, os filtros laterais passam para uma janela. As imagens atuais são
temporárias e podem ser substituídas sem alterar essa estrutura.

Validação: `npm test` verifica as regras de seleção e ordenação; `npm run build`
verifica os tipos e a compilação. Mudanças de interface também devem ser
conferidas no navegador, incluindo pesquisa, filtros e abertura/fechamento das
janelas afetadas.
