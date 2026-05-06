ISSUES TO CREATE / Atualizar — aragon-app

Resumo
- Lista de issues preparada a partir de PLAN.md, PLAN_subtasks.md e SPRINT_TASKS.md.
- Cada checkbox inclui tags obrigatórias: labels, status, priority, estimate, start/end.
- Há um template de comando gh CLI no final para criar issues rapidamente.

Notas
- Antes de criar issues, confirme assignees e milestone.
- Não crie issues em lote sem revisão; crie PRs separados quando for alterar código.

Checklist de issues (próximas prioridades)

- [ ] Verificar `prepare/install` inclui `validator_address` no payload [labels:area:frontend,type:qa] [status:TODO] [priority:high] [estimate:2h] [start:2026-01-20] [end:2026-01-20]
  Title sugestão: "fix(installer): include validator_address in prepare payload"
  Body curto: Reproduzir fluxo de prepare/install e garantir que o payload de prepare contenha `validator_address`. Incluir captura da requisição (Network) e passos de reprodução.

- [ ] Normalizar e validar validator address (lowercase) [labels:area:frontend,type:bug] [status:TODO] [priority:high] [estimate:1h] [start:2026-01-20] [end:2026-01-20]
  Title sugestão: "chore(input): normalize and validate validator address (lowercase)"
  Body curto: Garantir que endereços sejam normalizados para lowercase ao salvar/exibir e que o validador de formato impeça submit com helper text.

- [ ] Adicionar testes unitários para o builder de instalação [labels:area:frontend,type:test] [status:TODO] [priority:medium] [estimate:2h] [start:2026-01-20] [end:2026-01-20]
  Title sugestão: "test(installer): add unit tests for install builder (validator address)"
  Body curto: Cobrir happy path e invalid address; arquivo alvo: src/__tests__/install-builder.spec.ts

- [ ] Implementar placeholder UI quando metadata ausente [labels:area:frontend,type:feature] [status:TODO] [priority:high] [estimate:3h] [start:2026-01-22] [end:2026-01-22]
  Title sugestão: "feat(ui): placeholder for proposals without metadata"
  Body curto: Renderizar título/resumo padrão, CTA para retry; evitar crashes.

- [ ] Definir ordem de fallback de metadata (subgraph → backend cache → placeholder) [labels:area:indexing,area:frontend,type:feature] [status:TODO] [priority:medium] [estimate:2h] [start:2026-01-22] [end:2026-01-22]
  Title sugestão: "chore(data): implement metadata fallback order"
  Body curto: Priorizar subgraph, depois backend cache, por fim placeholder.

- [ ] Graceful handling quando backend indisponível (banners/toasts + retry) [labels:area:frontend,type:feature] [status:TODO] [priority:high] [estimate:3h] [start:2026-01-22] [end:2026-01-22]
  Title sugestão: "feat(ui): graceful backend-unavailable handling"
  Body curto: Mostrar banner com ação retry, prevenir crashes nas chamadas falhas.

- [ ] Loading states claros para operações dependentes do backend [labels:area:frontend,type:task] [status:TODO] [priority:medium] [estimate:2h] [start:2026-01-23] [end:2026-01-23]
  Title sugestão: "ui: show loaders and disabled states for backend operations"
  Body curto: Botões e listas com loaders/disabled states; docar comportamentos.

- [ ] Implementar fluxo de confirmação de uninstall com avisos claros [labels:area:frontend,type:feature] [status:TODO] [priority:medium] [estimate:4h] [start:2026-01-28] [end:2026-01-28]
  Title sugestão: "feat(uninstall): confirmation flow and warnings"
  Body curto: Dialog com consequências claras; estado consistente após uninstall.

- [ ] Remover/ocultar dados de plugins desinstalados no frontend [labels:area:frontend,type:bug] [status:TODO] [priority:high] [estimate:2h] [start:2026-01-29] [end:2026-01-29]
  Title sugestão: "fix(uninstall): cleanup stale plugin data in UI"
  Body curto: Garantir que não existam itens obsoletos visíveis e re-install possível sem inconsistência.

- [ ] Documentar E2E manual checklist (install → propose → vote → execute → uninstall) [labels:type:docs,area:testing] [status:TODO] [priority:low] [estimate:1.5h] [start:2026-01-20] [end:2026-01-20]
  Title sugestão: "docs(test): E2E manual checklist for Harmony flows"
  Body curto: Passos e critérios para QA e automação futura.

- [ ] Verificar propostas aparecem no UI após criação (monitoring/indexing) [labels:area:indexing,type:qa] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-27] [end:2026-01-27]
  Title sugestão: "qa(indexing): verify proposals surface in UI after creation"
  Body curto: Passos para validar indexer/backend está entregando metadata e que UI renderiza propostas.

- [ ] Native-token UX: mostrar fee/value corretamente no review/execution [labels:area:frontend,type:feature] [status:TODO] [priority:medium] [estimate:6h] [start:2026-02-03] [end:2026-02-03]
  Title sugestão: "feat(tx): correct native-token fee/value semantics in review"
  Body curto: Revisar exibição de fees e valores nativos nos diálogos de revisão/execução.


Comando gh CLI (template)

Exemplo para criar uma issue usando gh:

gh issue create \
  --title "<TITLE>" \
  --body "<short description and steps>\n\nSee: ISSUES_TO_CREATE.md" \
  --label "area:frontend" --label "type:bug" \
  --assignee "@TODO"

Substitua labels/assignee/milestone conforme necessário.


Fim do arquivo
