# aragon-app — Sprint Subtasks

Este arquivo contém subtarefas acionáveis e critérios de aceite para orientar o agente encarregado da execução durante a sprint de retomada.

## 1) Preparar / Verificar Install (validator address)
- [ ] Reproduzir fluxo de prepare/install com endereço de validator (local dev) [key:01KFRBVBNPNVY45RGBRPA0195G]
  - Acceptance: prepare retorna params corretos incluindo validator address
  - Estimate: 2h
- [ ] Corrigir encoding/normalização (lowercase) do address se necessário [key:01KFRBVBNPNVY45RGBRPA0195H]
  - Acceptance: endereços salvos/mostrados em lowercase; validação ativa
  - Estimate: 1h
- [ ] Adicionar testes unitários para o builder de instalação [key:01KFRBVBNPNVY45RGBRPA0195J]
  - Acceptance: cobertura mínima para casos happypath e invalid address
  - Estimate: 2h

## 2) Metadata fallbacks & placeholders
- [ ] Implementar placeholder UI quando metadata estiver ausente [key:01KFRBVBNPNVY45RGBRPA0195K]
  - Acceptance: propostas renderizam com título/resumo padrão sem erro
  - Estimate: 3h
- [ ] Definir ordem de fallback no frontend (substituir por backend quando disponível) [key:01KFRBVBNPNVY45RGBRPA0195M]
  - Acceptance: UI tenta: subgraph → backend cache → placeholder
  - Estimate: 2h

## 3) Graceful backend-unavailable handling
- [ ] Garantir que chamadas falhas não quebrem a UI (toasts / banners) [key:01KFRBVBNPNVY45RGBRPA0195N]
  - Acceptance: falha de rede mostra banner com ação retry; componentes não crasham
  - Estimate: 3h
- [ ] Definir loading states claros para operações dependentes do backend [key:01KFRBVBNPNVY45RGBRPA0195P]
  - Acceptance: botões e listas mostram loaders/disabled states
  - Estimate: 2h

## 4) Uninstall UX & cleanup
- [ ] Implementar fluxo de confirmação com avisos claros e consequências [key:01KFRBVBNPNVY45RGBRPA0195Q]
  - Acceptance: usuário confirma e UI remove entradas; restaura estado consistente
  - Estimate: 4h
- [ ] Remover/ocultar dados de plugins desinstalados no frontend [key:01KFRBVBNPNVY45RGBRPA0195R]
  - Acceptance: não há itens obsoletos visíveis após uninstall
  - Estimate: 2h

## 5) E2E test notes (frontend)
- [ ] Documentar passos de teste manual e critérios (install → propose → vote → execute → uninstall) [key:01KFRBVBNPNVY45RGBRPA0195S]
  - Acceptance: checklist clara para QA e para automação futura
  - Estimate: 1.5h

---
Arquivo criado para orientar execução — não crie issues automaticamente sem confirmação.
