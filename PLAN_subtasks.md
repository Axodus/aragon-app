# aragon-app — Sprint Subtasks

Este arquivo contém subtarefas acionáveis e critérios de aceite para orientar o agente encarregado da execução durante a sprint de retomada.

## 1) Preparar / Verificar Install (validator address)
- [ ] Reproduzir fluxo de prepare/install com endereço de validator (local dev)
  - Acceptance: prepare retorna params corretos incluindo validator address
  - Estimate: 2h
- [ ] Corrigir encoding/normalização (lowercase) do address se necessário
  - Acceptance: endereços salvos/mostrados em lowercase; validação ativa
  - Estimate: 1h
- [ ] Adicionar testes unitários para o builder de instalação
  - Acceptance: cobertura mínima para casos happypath e invalid address
  - Estimate: 2h

## 2) Metadata fallbacks & placeholders
- [ ] Implementar placeholder UI quando metadata estiver ausente
  - Acceptance: propostas renderizam com título/resumo padrão sem erro
  - Estimate: 3h
- [ ] Definir ordem de fallback no frontend (substituir por backend quando disponível)
  - Acceptance: UI tenta: subgraph → backend cache → placeholder
  - Estimate: 2h

## 3) Graceful backend-unavailable handling
- [ ] Garantir que chamadas falhas não quebrem a UI (toasts / banners)
  - Acceptance: falha de rede mostra banner com ação retry; componentes não crasham
  - Estimate: 3h
- [ ] Definir loading states claros para operações dependentes do backend
  - Acceptance: botões e listas mostram loaders/disabled states
  - Estimate: 2h

## 4) Uninstall UX & cleanup
- [ ] Implementar fluxo de confirmação com avisos claros e consequências
  - Acceptance: usuário confirma e UI remove entradas; restaura estado consistente
  - Estimate: 4h
- [ ] Remover/ocultar dados de plugins desinstalados no frontend
  - Acceptance: não há itens obsoletos visíveis após uninstall
  - Estimate: 2h

## 5) E2E test notes (frontend)
- [ ] Documentar passos de teste manual e critérios (install → propose → vote → execute → uninstall)
  - Acceptance: checklist clara para QA e para automação futura
  - Estimate: 1.5h

---
Arquivo criado para orientar execução — não crie issues automaticamente sem confirmação.
