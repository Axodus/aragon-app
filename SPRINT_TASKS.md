# Sprint 1 — Retomada: Frontend (aragon-app)

Período: 20/01/2026 — 02/02/2026

Objetivo: validar e corrigir o fluxo de `prepare/install` com o `validator address`, implementar fallbacks de metadata e preparar E2E básico (install → propose → vote → execute → uninstall).

Instruções gerais
- Execute o app localmente com `pnpm dev` a partir da raiz de `aragon-app`.
- Abra o browser em http://localhost:3000 (ou porta configurada) e use uma conta de teste.
- Registre todos os comandos, logs e comandos de rede (DevTools Network) durante reprodução.

Task A — Verificar `prepare/install` (validator address)
- Objetivo: confirmar que o builder de instalação inclui o `validator address` corretamente e que a UI mostra validação/erros apropriados.
- Passos de reprodução:
  1. `pnpm install` e `pnpm dev` em `aragon-app`.
  2. Navegar até fluxo de instalação do plugin Harmony Delegation (Installer/Setup form).
  3. Preencher `validator address` com um endereço válido e inválido (testar casos de validação).
  4. Clique em `Prepare` / `Review` (ou o botão equivalente) e observe a requisição de preparação (Network tab) e os parâmetros enviados.
  5. Abrir o diálogo de transação (tx dialog) e verificar se os detalhes mostram o `validator address` (lowercased) e erros detalhados quando ocorrem.
- Arquivos/funções para revisar (sugestões):
  - `src/plugins/*/install/*` — builders / setup serializers
  - `src/modules/install` ou `src/modules/compose` — formulários e state handlers
  - `src/shared/validators/*` — validação de endereço
  - `src/components/TxDialog*` — exibição de erros de prepare
- Critérios de aceite:
  - Prepare request inclui `validator_address` no payload.
  - Endereços normalizados para lowercase antes do envio e exibição.
  - Validação de formato impede submit e mostra helper text para input inválido.
  - Testes unitários cobrindo encoding/validation adicionados em `src/__tests__/install-builder.spec.ts`.
- Estimativa: 2.5h (reprodução + correção + teste básico)

Task B — Metadata fallbacks & placeholders
- Objetivo: garantir que propostas renderizem com placeholders quando metadata ausente.
- Passos de reprodução:
  1. Simular ausência de metadata (forçar resposta vazia do back-end/subgraph ou desconectar cache).
  2. Verificar renderização de lista de propostas e página de detalhe.
- Arquivos/funções para revisar:
  - `src/views/ProposalList*`, `src/views/ProposalDetail*`
  - Data fetching hooks `src/hooks/useProposals` / `src/services/api`.
- Critérios de aceite:
  - Propostas sem metadata mostram título/resumo padrão sem crash.
  - Placeholder inclui CTA para re-tentar carregar metadata.
  - Loading + error states documentados e visíveis.
- Estimativa: 3h

Task C — Uninstall UX & cleanup
- Objetivo: tornar a desinstalação clara e limpar UI de entradas obsoletas.
- Passos de reprodução:
  1. Instalar plugin em ambiente local (ou usar mock state que simule instalação).
  2. Execute fluxo de uninstall e confirme warnings/confirm dialog.
  3. Verificar que a UI remove listas/entradas relacionadas ao plugin e que não restam links quebrados.
- Critérios de aceite:
  - Fluxo de confirmação com texto claro sobre consequencias.
  - Após uninstall, não há referências visíveis ao plugin nas listas do DAO.
  - Possibilidade de re-instalar sem estado inconsistente.
- Estimativa: 6h

Task D — E2E manual checklist (para QA)
- Steps (manual):
  1. Install plugin (com validator address) — prepare + confirm.
  2. Criar proposta usando o builder do plugin.
  3. Votar (vote cast) por uma conta diferente.
  4. Executar a proposta (se aplicável).
  5. Uninstall plugin e verificar limpeza.
- Acceptance: fluxo completo executado sem erros e propostas aparecem no UI após finality.

Reporting & artefatos
- Para cada task, crie um PR com: descrição curta, arquivos alterados, screenshots (se UI), e comandos para reproduzir.
- Nome do PR: `fix: <area> — <breve descrição>` (seguir conventional commits).
- Adicione a checklist desta task ao corpo do PR.

Assignees / placeholders
- Assignee: @TODO (preencher conforme alocação)
- Branch: `feature/sprint1/<short-desc>`

Notas finais
- Não aplique commits automáticos para múltiplos repos sem revisão; crie PRs e aguarde aprovação.
- Se preferir, gero templates de issue/PR a partir deste checklist — solicite `gerar-templates`.
