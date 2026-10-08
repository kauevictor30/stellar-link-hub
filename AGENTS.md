<!-- gerado por ZenBrief a partir do briefing + stack + skills -->
# AGENTS.md — stellar-link-hub

> Stack: Next.js + TypeScript + Tailwind, Next.js + API Routes
> Sem banco de dados nesta fase (estado em memória/localStorage). Sem auth/deploy.

## Visão (do briefing)

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
- Confirmaç…

## Regras do projeto

- Faça o que foi pedido; nada além.
- Prefira editar arquivos existentes a criar novos.
- Sempre leia um arquivo antes de editá-lo.
- Nunca commite segredos, credenciais ou .env.
- Rode `npm run build` (e lint) após mudanças de código.
- Chaves de API só em route handlers server-side (`app/api/*`); nunca no cliente.

## Agentes e comandos

- `scout` (.opencode/agents/scout.md): estuda o contexto antes de codar.
- `/briefing` e `/scaffold` (.opencode/commands/): tarefas repetitivas do fluxo.

## Skills (.opencode/skills/, via tool `skill`)

- `react-patterns` — Componentes, hooks e Server/Client Components
- `tailwind-ui` — Design system, tokens e responsivo acessível
- `database` — Modelagem e migrations para quando sair do MVP
- `testing` — Vitest + Playwright nas rotas críticas
- `stellar` — SDK JS, Freighter, SAC e Soroban na testnet
