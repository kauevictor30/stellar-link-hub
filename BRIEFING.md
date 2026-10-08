## 1. Visão geral

O **stellar-link-hub** será um agregador de links voltados a comunidades de desenvolvimento.  
A primeira versão oferecerá navegação minimalista, busca e CRUD de recursos educativos.  
A interface seguirá Design Atômico, com componentes organizados por nível de responsabilidade.  
A persistência será temporária em memória, complemented por cache local no `localStorage`.  
A arquitetura separará domínio, APIs e integrações para permitir Stellar/Web3 futuramente.

## 2. Escopo MVP

### Dentro do escopo

- Listagem de recursos em formato de cards ou lista compacta.
- Busca por título, resumo, categoria e tags.
- Filtro por categoria e ordenação alfabética ou por data.
- Página de detalhes com link externo para o recurso.
- Criação, edição e exclusão de recursos.
- Confirmação antes de excluir.
- Validação de campos e URLs `http`/`https`.
- Estados de carregamento, lista vazia e erro.
- Layout responsivo, acessível e orientado a teclado.
- Route Handlers do Next.js para o CRUD.
- Repositório em memória como fonte de verdade do MVP.
- Cache da última listagem e preferências no `localStorage`.
- Componentes organizados por Design Atômico.
- Interfaces de gateway e repositório preparadas para futuros adaptadores Stellar.

### Fora do escopo

- Banco de dados, ORM e migrações.
- Autenticação, autorização e perfis de usuário.
- Deploy e configuração de ambientes.
- Carteiras Stellar, smart contracts e Stellar SDK.
- Login social, recovering de conta e assinatura de transações.
- Comentários, curtidas, collaborative editing e moderação.
- Sincronização em tempo real e múltiplas instâncias.
- Analytics, notifications e recomendações personalizadas.
- Paginação avançada ou busca server-side em grande volume.

## 3. Arquitetura sugerida

### Princípios

- Usar **Next.js App Router**, TypeScript estrito e Tailwind CSS.
- Manter o domínio independente de React, Next.js e Stellar.
- Usar Route Handlers em `app/api` como contrato HTTP do MVP.
- Evitar bibliotecas de estado, validação ou UI além do necessário.
- Compor dependências explicitamente, sem acoplar componentes a implementações.
- Tratar a memória como armazenamento volátil e não como persistência definitiva.

### Organização de pastas

- `app/layout.tsx`: layout raiz, metadados e providers globais.
- `app/globals.css`: estilos base, tokens visuais e utilitários Tailwind.
- `app/page.tsx`: página inicial enxuta com chamada para a área de recursos.
- `app/(hub)/resources/page.tsx`: listagem, busca e filtros.
- `app/(hub)/resources/new/page.tsx`: formulário de criação.
- `app/(hub)/resources/[id]/page.tsx`: detalhes do recurso.
- `app/(hub)/resources/[id]/edit/page.tsx`: formulário de edição.
- `app/error.tsx`, `app/not-found.tsx` e `app/loading.tsx`: estados globais.

O route group `(hub)` organiza a navegação sem alterar as URLs públicas.

### APIs

- `GET /api/resources`: lista recursos, com filtros opcionais por `q`, `category` e `tag`.
- `POST /api/resources`: cria um recurso.
- `GET /api/resources/[id]`: obtém um recurso específico.
- `PATCH /api/resources/[id]`: atualiza campos permitted.
- `DELETE /api/resources/[id]`: remove um recurso.

Contratos sugeridos:

- `201 Created` para criação.
- `204 No Content` para exclusão.
- `400 Bad Request` para validação inválida.
- `404 Not Found` para recurso inexistente.
- Respostas de sucesso no formato `{ data, meta }`.
- Respostas de erro no formato `{ error: { code, message, fields? } }`.

IDs serão gerados com `crypto.randomUUID()`. A validação deverá existir no formulário e novamente nos Route Handlers, usando funções TypeScript puras compartilhadas.

### Domínio e persistência

- `lib/domain/resource.ts`: entidade `Resource` e tipos relacionados.
- `lib/domain/resource-query.ts`: filtros, ordenação e paginação futura.
- `lib/validation/resource.ts`: schemas lógicos e validadores sem dependências.
- `lib/repositories/resource-repository.ts`: interface do repositório.
- `lib/repositories/in-memory-resource-repository.ts`: implementação do MVP.
- `lib/repositories/index.ts`: seleção da implementação ativa.
- `lib/services/resource-service.ts`: regras de criação, edição, busca e exclusão.
- `lib/container.ts`: composição das dependências no servidor.

O repositório em memória deve ser singleton por processo e sobreviver, quando possível, ao hot reload por meio de uma instância associada ao `globalThis`. Em dev serverless ou após reinício, os dados poderão ser perdidos.

### Cliente e cache

- `lib/gateways/resource-gateway.ts`: contrato consumido pela interface.
- `lib/gateways/http-resource-gateway.ts`: implementação sobre `fetch`.
- `lib/providers/resource-provider.ts`: estado React e ações do CRUD.
- `lib/storage/client-cache.ts`: acesso seguro ao `localStorage`.
- `lib/constants/cache-keys.ts`: chaves versionadas, como `stellar-link-hub:resources:v1`.

O fluxo principal será:

`Componente → ResourceGateway → /api/resources → ResourceService → ResourceRepository`

O `localStorage` não será uma segunda fonte de verdade. Ele armazenará:

- A última listagem recebida com sucesso.
- Preferências de busca, filtro e ordenação.
- Data de atualização paraCTC判断 de cache expirado.

Falhas de leitura, JSON inválido ou mudança de versão devem resulted in descarte seguro do cache. Mutações atualizarão a memória do cliente e invalidarão a listagem armazenada.

### Design Atômico

- `components/atoms/`: `Button`, `IconButton`, `Input`, `Textarea`, `Badge`, `Label` e `Spinner`.
- `components/molecules/`: `SearchField`, `FilterBar`, `ResourceCard`, `ResourceFormField` e `EmptyState`.
- `components/organisms/`: `SiteHeader`, `ResourceExplorer`, `ResourceForm`, `ResourceDetails` e `ConfirmDialog`.
- `components/templates/`: `AppShell`, `HubTemplate` e `ResourceEditorTemplate`.
- `app/`: composição final dos templates nas páginas.

Átomos não conhecem regras de negócio. Moléculas agrupam átomos com uma responsabilidade simples. Organismos encapsalam fluxos interativos, enquanto templates definem a estrutura visual das páginas.

### Estratégia frontend

- Shell e conteúdo estático como Server Components.
- Client Components apenas em busca, filtros, formulários e confirmações.
- Estado local com React e, se necessário, um provider pequeno em vez de Redux.
- Tokens de espaçamento, cor, borda e tipografia centralizados no Tailwind.
- Skeletons leves, navegação por teclado e áreas de foco visíveis.
- Links externos com indicação de nova aba e atributos seguros.
- Campos e mensagens associados por IDs e `aria-describedby`.
- Listas semânticas e navegação com landmarks como `header`, `nav` e `main`.

### Preparação para Web3

- `lib/gateways/resource-gateway.ts` permitirá substituir HTTP por uma implementação Stellar sem alterar componentes.
- `lib/repositories/resource-repository.ts` permitirá substituir memória por um adaptador de smart contract.
- `lib/integrations/stellar/` será reservado futuramente para mapeadores, clientes e adaptadores.
- Identidade, assinatura e autorização deverão ser casos de uso separados de `Resource`.
- Nenhum SDK, carteira ou conceito Web3 deve entrar no MVP.
- Mudanças de contrato deverão passar por testes de compatibilidade e documentação de versão.

## 4. Integração opencode

A automação一度 deve ficar contida em `.opencode/`, evitando dependências de banco, autenticação ou infraestrutura.

- `.opencode/AGENTS.md`
  - Contexto do projeto e objetivo do MVP.
  - Regras arquiteturais e突发 decisõesVED.
  - Proibições explícitas: banco, auth, deploy e Stellar SDK.
  - Padrões de Design Atômico, TypeScript e Tailwind.
  - Checklist de validação, acessibilidade e testes.
  - Instruções para manter contratos estáveis e evitar vendor lock-in.

- `.opencode/agents/`
  - `architect.md`: decomposição, contratos e impacto de mudanças.
  - `frontend.md`: App Router, atomicidade visual, performance e acessibilidade.
  - `api.md`: Route Handlers, validação, erros e repositórios.
  - `reviewer.md`: revisão de escopo, regressões e aderência às restrições.
  - `web3-readiness.md`: análise de准备工作 para Stellar sem implementar a integração.

- `.opencode/commands/`
  - `plan-feature.md`: produz plano, dependências e critérios de aceite.
  - `implement-resource-crud.md`: executa uma alteração vertical completa.
  - `review-api.md`: revisa contratos, validação e treatment de erros.
  - `review-ui.md`: revisa atomicidade, responsividade e acessibilidade.
  - `web3-readiness.md`: verifica se a mudança introduziu acoplamento desnecessário.

- `.opencode/opencode.json`
  - Configura o agente padrão e associations.
  - Declara agentes e commands disponíveis.
  - Restringe operações às NeedsInferencepermitidas para o projeto.
  - Evita credenciais, comandos destrutivos e dependências de infraestrutura.
  - Mantém configurações versionáveis e revisáveis.

A regra principal seráczy opencode working por_features pequenas e verticais, respeitando as fronteiras entre UI, gateway, API, serviço e repositório.

## 5. Riscos e próximos passos

1. **Persistência volátil:** dados em memória podem desaparecer em reinícios ou ao trocar de processo.  
   **Próximo passo:** documentar esse comportamento e manter o `ResourceRepository` como ponto único de troca futura.

2. **APIs sem autenticação:** os endpoints permitirão alterações por qualquer cliente acessível.  
   **Próximo passo:** limitar o uso ao ambiente local e não expor o projeto até auth, autorização e controles de abuse estarem definidos.

3. **Cache inconsistente ou corrompido:** `localStorage` pode conter dados antigos, inválidos ou de outra versão.  
   **Próximo passo:** adotar chaves versionadas, TTL, parsing defensivo e invalidação após mutações.

4. **Acoplamento prematuro a Stellar:** antecipar carteiras ou smart contracts pode distortar o domínio.  
   **Próximo passo:** validar primeiro contratos de gateway e repositório, registrando decisões antes de adicionar qualquer SDK.

5. **Qualidade frontend e de API:** excessos de client components, validação inconsistente e problemas de acessibilidade podem aumentar o custo.  
   **Próximo passo:** criar testes dos route handlers e das regras de domínio, além de validar teclado, foco, responsividade e estados de erro.
