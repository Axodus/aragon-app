# Plan: Repository Work Plan

This plan is the source of truth for work tracking.

Rules:
- Every checkbox line MUST include tags for labels, status, priority, estimate, start/end dates.
- Subtasks are indented by 2 spaces under their parent.
- Prefer short, action-oriented titles and include a brief description.

## Context: HarmonyVoting Frontend UI & UX Reliability

Goal
- Ensure the Aragon App implements HarmonyVoting flows with resilient UI/UX:
	- Setup inputs (validator address) and proposal builders
	- Clear uninstall UX and post-uninstall state
	- Metadata fallback and graceful degradation
	- Correct fee/value semantics and indexing-driven views

Scope
- Harmony network support in the app (routing, network config, plugin UI)
- E2E flows from install → propose/vote → execute → uninstall
- Backward compatible unless explicitly versioned

Dependencies / Integration Points
- Backend API/indexer availability and schemas
- Contracts/ABI updates for HarmonyVoting
- Network configuration and providers

Related Plans
- ../AragonOSX/PLAN.md — E2E reliability epic
- ../Aragon-app-backend/PLAN.md — Backend indexing

## Milestone: Frontend Setup & Feature Parity (Done Work)

- [x] Locate Harmony Delegation setup form and install data builder [labels:type:task, area:frontend] [status:DONE] [priority:medium] [estimate:1h] [start:2025-12-15] [end:2025-12-15]
- [x] Add validator address input for Delegation setup [labels:type:feature, area:frontend] [status:DONE] [priority:high] [estimate:2h] [start:2025-12-15] [end:2025-12-15]
- [x] Encode validator address into installation params (Delegation) [labels:type:feature, area:frontend] [status:DONE] [priority:high] [estimate:2h] [start:2025-12-16] [end:2025-12-16]
- [x] Basic validation + helper text for input [labels:type:task, area:frontend] [status:DONE] [priority:medium] [estimate:1h] [start:2025-12-16] [end:2025-12-16]
- [x] Sync validator address into form state on change [labels:type:task, area:frontend] [status:DONE] [priority:medium] [estimate:1h] [start:2025-12-16] [end:2025-12-16]
- [x] Surface prepare error details in tx dialog [labels:type:task, area:frontend] [status:DONE] [priority:medium] [estimate:1h] [start:2025-12-17] [end:2025-12-17]
- [x] Normalize Harmony repo addresses to lowercase [labels:type:task, area:frontend] [status:DONE] [priority:low] [estimate:1h] [start:2025-12-17] [end:2025-12-17]
- [x] Show Harmony Delegation short code (TDEL) in body info [labels:type:task, area:frontend] [status:DONE] [priority:low] [estimate:1h] [start:2025-12-17] [end:2025-12-17]
- [x] Add proposal settings (dates + snapshot block) [labels:type:feature, area:frontend] [status:DONE] [priority:medium] [estimate:2h] [start:2025-12-18] [end:2025-12-18]
- [x] Register Harmony proposal/vote builders [labels:type:task, area:frontend] [status:DONE] [priority:medium] [estimate:1h] [start:2025-12-18] [end:2025-12-18]
- [x] Use processKey as proposal prefix when defined [labels:type:task, area:frontend] [status:DONE] [priority:low] [estimate:1h] [start:2025-12-19] [end:2025-12-19]

## Milestone: Install & Prepare Flows

- [ ] Verify prepare installation with delegation validator address [labels:type:qa, area:frontend] [status:TODO] [priority:high] [estimate:2h] [start:2026-01-20] [end:2026-01-20]
- [ ] Summarize changes for UI testing (test notes) [labels:type:docs, area:testing] [status:TODO] [priority:low] [estimate:1h] [start:2026-01-20] [end:2026-01-20]

## Milestone: UI Resilience & Fallbacks

- [ ] Proposals appear even sem metadata (placeholder/fallback) [labels:type:feature, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-22] [end:2026-01-22]
- [ ] Graceful degradation quando backend indisponível (sem crash) [labels:type:feature, area:frontend] [status:TODO] [priority:high] [estimate:6h] [start:2026-01-22] [end:2026-01-23]
- [ ] Mensagens de erro amigáveis e acionáveis [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-01-23] [end:2026-01-23]
- [ ] Loading states claros p/ operações de backend [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-01-23] [end:2026-01-23]
- [ ] Troca de rede recarrega configs do plugin corretamente [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-01-24] [end:2026-01-24]

## Milestone: Uninstall UX & Post-Uninstall State

- [ ] Uninstall UX com avisos claros e estado pós-uninstall [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:8h] [start:2026-01-28] [end:2026-01-28]
- [ ] Remoção do plugin limpa UI (sem entradas antigas) [labels:type:task, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-29] [end:2026-01-29]

## Milestone: Native-Token UX

- [ ] Exibir semântica correta de taxa/valor em revisão/execução [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:6h] [start:2026-02-03] [end:2026-02-03]

## Milestone: E2E & Release Readiness

- [ ] Verificar propostas aparecem no UI após criação (monitoramento) [labels:type:qa, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-27] [end:2026-01-27]
- [ ] Checklist E2E no Harmony (App) [labels:type:qa, area:testing] [status:TODO] [priority:high] [estimate:4h] [start:2026-02-04] [end:2026-02-04]
