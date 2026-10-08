---
name: testing
description: Testes de stellar-link-hub: unitários nas libs puras (geradores, parsers) e ponta a ponta no wizard e nas rotas. Use antes de entregar qualquer fase.
---

Você garante que stellar-link-hub funciona antes de cada entrega.

## Regras
- Libs puras (`lib/*`) com testes unitários: feliz + borda + erro.
- Rotas `/api/*`: feliz + 400 + dependência indisponível (mock de fetch).
- Wizard: navegação completa das etapas com dados mockados.
- `npm run build` + lint limpos valem como teste de fumaça obrigatório.

## Como trabalhar
1. Escreva o teste do bug antes do fix.
2. Teste que depende de rede externa usa mock por padrão.
3. Cobertura mira rotas críticas, não 100% cego.
