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

## Cross-Repo: Admin Grant Task (Related)

- [x] **Admin grant task completed on AragonOSX repo** [labels:type:maintenance, area:infra, cross-repo] [status:DONE] [priority:high] [estimate:4h] [start:2026-01-20] [end:2026-01-20]
  - See: `../AragonOSX/PLAN_admin_grant_closeout.md`
  - Outcome: Direct `DAO.grant(...)` workaround verified on Harmony; admin permission now active on DAO `0x4e48...`.
  - Verification script available: `../AragonOSX/scripts/verify-grant.sh`
  - Impact: No frontend changes required; backend/contracts/SDK can proceed with admin-gated features.

## Milestone: UI Resilience & Fallbacks

- [ ] Ensure proposals render even without metadata (placeholder/fallback) [labels:type:feature, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-22] [end:2026-01-22]
- [ ] Graceful degradation when backend is unavailable (no crashes) [labels:type:feature, area:frontend] [status:TODO] [priority:high] [estimate:6h] [start:2026-01-22] [end:2026-01-23]
- [ ] User-friendly and actionable error messages [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-01-23] [end:2026-01-23]
- [ ] Clear loading states for backend-driven operations [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-01-23] [end:2026-01-23]
- [ ] Network switch reloads plugin configuration correctly [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-01-24] [end:2026-01-24]

## Milestone: Uninstall UX & Post-Uninstall State

- [ ] Uninstall UX with clear warnings and post-uninstall state [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:8h] [start:2026-01-28] [end:2026-01-28]
- [ ] Plugin removal cleans UI (no stale entries) [labels:type:task, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-29] [end:2026-01-29]

## Milestone: Native-Token UX

- [ ] Show correct fee/value semantics in review and execution [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:6h] [start:2026-02-03] [end:2026-02-03]

## Milestone: E2E & Release Readiness

- [ ] Verify proposals appear in UI after creation (monitoring) [labels:type:qa, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-27] [end:2026-01-27]
- [ ] Harmony E2E checklist (App) [labels:type:qa, area:testing] [status:TODO] [priority:high] [estimate:4h] [start:2026-02-04] [end:2026-02-04]

## Milestone: ProjectV2 Schema & Sync

- [ ] Verify .gitissue/metadata.config.json at repo root [labels:type:chore, area:planning] [status:TODO] [priority:low] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19]
- [ ] Capture org project schema to tmp/<org>-project-schema.json [labels:type:task, area:planning] [status:TODO] [priority:low] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19]
- [ ] Generate .gitissue/metadata.generated.json from PLAN.md [labels:type:task, area:planning] [status:TODO] [priority:low] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19]
- [ ] Prepare gh issue create/edit commands for project sync (request approval before running) [labels:type:docs, area:planning] [status:TODO] [priority:low] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19]
- [ ] Document workaround for PARENT_ISSUE field limitation in GitHub ProjectV2 (manual UI linking or UI automation) [labels:type:docs, area:planning] [status:TODO] [priority:low] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19]

## Subtasks for Sprint Execution

- See `PLAN_subtasks.md` for detailed checklists, acceptance criteria and estimates for the top-priority items (prepare/install verification, metadata fallbacks, UI resilience, uninstall UX, E2E QA).

Subtasks file: PLAN_subtasks.md

-  See `uninstall-fix.md` for detailed plan on uninstall fix validation and rollback strategy.
Subtasks file: uninstall-fix.md

## Issues prepared for creation

I preparei uma lista de issues pronta para criar/atualizar no repositório. Ver `ISSUES_TO_CREATE.md` para títulos, descrições curtas, labels e comandos sugeridos (gh CLI). Use esse arquivo como fonte para criar PRs/issues individuais.
