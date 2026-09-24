# Ju Catálogo

- `catalogo/`: página pública dos clientes.
- `admin/`: painel de gestão de produtos, com acesso restrito quando implementado.
- Preserve a separação entre as duas áreas.
- O fluxo Git é manual: não executar commit, pull, push ou deploy sem pedido explícito do usuário.
- Ao concluir alterações, indicar o executável apropriado e uma mensagem curta de commit.
- Usar `commit_catalogo.bat`, `commit_admin.bat` ou `commit_catalogo_admin.bat` para as áreas da aplicação.
- Usar `commit_projeto.bat` para arquivos gerais e `atualizar_do_git.bat` para atualização local.
- Não incluir segredos ou dados privados no repositório.

## Organização do catálogo

- Manter `catalogo/src/App.tsx` como entrada pequena: carregamento inicial e escolha da página.
- Usar `pages/` para compor a página, `components/` para partes visuais com propriedades tipadas e `hooks/` para estado e efeitos.
- Manter regras puras de busca, filtros e ordenação em `catalog/`, acesso e validação dos dados em `data.ts` e formatação compartilhada em `utils/`.
- Cada card deve ser renderizado por `ProductCard`, com marca, nome, descrição e cores vindos dos dados; não duplicar sua estrutura por produto.
- Ao adicionar funcionalidades, ampliar o módulo responsável ou extrair um componente coeso; não voltar a concentrar a página e seus controles no `App.tsx`.
- Preservar classes e estrutura visual em refatorações, salvo quando houver pedido de mudança de layout. Evitar novos overrides de CSS quando a regra existente puder ser ajustada.
- Validar mudanças de lógica com testes e verificar os fluxos afetados no navegador; executar a compilação após alterações estruturais.
