# Administração do Ju Catálogo

Painel React/Vite separado do catálogo público. A interface é mobile-first e
também oferece navegação lateral no desktop.

## Desenvolvimento

```powershell
npm install
npm run dev
```

O painel abre em `http://127.0.0.1:5174/admin/` e lê os JSONs demonstrativos do
catálogo. Edições ficam somente no armazenamento local do navegador. Na seção
de produtos, “Baixar JSON” gera `produtos.json`. Na seção de categorias, o mesmo
botão gera `estrutura.json`, com as categorias e subcategorias usadas para
construir o menu do catálogo público.

As imagens de produtos são enviadas pelo formulário ou selecionadas entre os
arquivos existentes no R2. O arquivo usa o nome do produto; quando o nome já
existe, recebe automaticamente os sufixos `-2`, `-3` e seguintes.

Autenticação, API de gravação e R2 ainda não estão conectados. Essas integrações
devem entrar pela camada `src/services/`, sem expor credenciais no frontend.
