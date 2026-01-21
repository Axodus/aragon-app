# PLAN: aragon-app — HarmonyVoting Frontend UI & UX Production Release

**Repository:** aragon-app (Axodus/aragon-app)  
**Current Branch:** develop  
**Default Branch:** develop  
**Last Updated:** 2026-01-21  
**Status:** Active

---

## Executive Summary

Complete HarmonyVoting frontend implementation with resilient UI/UX, graceful degradation, plugin uninstall flows, and metadata fallback support. Integrated with contracts and backend APIs.

### Key Metrics
- **Total Planned Work:** 120 hours
- **Completion:** 45% (11 of 26 sprint items done)
- **Active Features:** 4 (Setup Forms, Install Flows, UI Resilience, Uninstall UX)
- **Open Bugs:** 3 (1 fixed, 1 in progress, 1 investigating)
- **Timeline:** 6-week sprint, targeting 2026-02-28 release

---

## Context & Vision

### Goal

Deliver production-ready HarmonyVoting frontend covering:
- **Plugin setup & installation:** Forms with validator address input + validation
- **Proposal governance UX:** Create/vote/execute flows with clear feedback
- **Plugin uninstall:** Safe removal with warnings + post-uninstall state
- **Resilient metadata:** Fallback sourcing with graceful degradation
- **Native-token execution:** Clear fee/value semantics in UI

### Scope

- Harmony network support in app routing + network config
- E2E flows: install → propose/vote → execute → uninstall → re-install
- Backward compatible changes unless explicitly versioned

### Acceptance Criteria

- [x] Plugin setup form with validator address input + validation
- [ ] Proposal creation/voting UI displays correctly (in progress)
- [ ] Metadata fallback prevents broken proposal cards
- [ ] Uninstall flow shows warnings + enables re-install
- [ ] Native-token execution shows fees in review
- [ ] Network switch reloads plugin configuration correctly

### Dependencies & Integration Points

| Component | Repository | Status | Notes |
|-----------|-----------|--------|-------|
| **Plugin Setup** | AragonOSX/packages/contracts | Completed | HarmonyVoting setup contract |
| **Indexing** | Aragon-app-backend | In Progress | Event handlers + metadata API |
| **Metadata API** | Aragon-app-backend | In Progress | Fallback metadata sourcing |
| **Network Defs** | aragon-app | In Progress | Update networkDefinitions.ts |
| **Frontend UI Kit** | aragon-governance-ui-kit | Stable | UI components + styling |

### Known Risks & Mitigations

| Risk | Severity | Mitigation | Status |
|------|----------|-----------|--------|
| Metadata API downtime | Medium | UI fallback to placeholder | 🔄 In progress |
| Backend API unavailable | Medium | Graceful error handling | 🔄 In progress |
| Network switch lag | Low | Reload plugin config on switch | ✅ Fixed |
| Address case sensitivity | Low | Normalize all addresses lowercase | ✅ Fixed |
| Slow metadata fetch | Medium | Async loading + timeout | 🔄 In progress |

---

## Milestone Breakdown

### ✅ Milestone 1: Plugin Setup & Forms (COMPLETED)

**Status:** 100% complete (2026-01-13 → 2026-01-21)

- [x] Add validator address input to setup form
- [x] Encode validator address into installation params
- [x] Normalize addresses to lowercase
- [x] Add proposal settings (dates, snapshot block)
- [x] Register proposal/vote builders

**Outcome:** Plugin setup UI complete and ready for integration testing.

---

### 🔄 Milestone 2: Install & Prepare Flows (50% COMPLETE)

**Status:** In Progress (2026-01-20 → 2026-02-04)  
**Target:** Safe installation with clear error feedback

- [x] Implement setup form + validator input
- [ ] Verify prepare installation with validator address (in progress)
- [ ] Display prepare errors clearly to user
- [ ] Test form submission + state recovery

**Effort:** 12h remaining

---

### 🔄 Milestone 3: UI Resilience & Fallbacks (33% COMPLETE)

**Status:** In Progress (2026-01-22 → 2026-02-11)  
**Target:** Graceful degradation when backend unavailable

- [ ] Render proposals without metadata (placeholder fallback)
- [ ] Handle backend unavailability gracefully
- [ ] Implement fallback metadata fetching
- [ ] Add user-friendly error messages
- [ ] Clear loading states for async operations

**Effort:** 18h remaining

---

### 🔄 Milestone 4: Plugin Uninstall UX (0% COMPLETE)

**Status:** Pending (2026-02-05 → 2026-02-18)  
**Target:** Safe uninstall with re-install support

- [ ] Uninstall confirmation dialog with clear warnings
- [ ] Handle post-uninstall state (plugin removed message)
- [ ] Enable re-install after uninstall
- [ ] Show any permission cleanup status

**Effort:** 16h remaining

---

### 🔄 Milestone 5: Native-Token Execution (25% COMPLETE)

**Status:** In Progress (2026-01-28 → 2026-02-16)  
**Target:** Display native-token fee/value semantics

- [ ] Display native-token value in execution review
- [ ] Show fee breakdown for transactions
- [ ] Confirm receipt after execution
- [ ] Handle native-token rejection gracefully

**Effort:** 12h remaining

---

### ❌ Milestone 6: E2E Testing & Release (0% COMPLETE)

**Status:** Pending (2026-02-19 → 2026-02-28)  
**Target:** Production release with full testing

- [ ] E2E flow tests (Playwright/Cypress)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance benchmarks (UI latency, bundle size)
- [ ] Load testing (concurrent users)

**Effort:** 24h remaining

---

## Execution Checklist

### Weekly Planning

Each Monday (9:00 UTC):
- [ ] Review sprint progress vs. baseline
- [ ] Identify blockers and risks (backend API availability)
- [ ] Adjust feature priorities if needed
- [ ] Update SPRINT.md with progress snapshot

### Sign-Off Path

**Feature Completion:**
1. Developer: Create PR with tests + accessibility checks
2. Reviewer: Code review + approve
3. QA: Test on staging + network switch scenarios
4. PM: Update SPRINT.md + mark DONE

**Release Gate (Feb 28):**
1. All 6 milestones at 100%
2. All bugs FIXED or VERIFIED
3. E2E tests passing on testnet
4. Accessibility audit complete
5. Bundle size optimized

---

## File Structure & References

| File | Purpose | Update Frequency |
|------|---------|------------------|
| PLAN.md | Master milestones | Weekly |
| SPRINT.md | Feature status + effort | Daily |
| FEATURE.md | Feature backlog | Per feature |
| TASK.md | Task inventory | Weekly |
| BUG.md | Issue tracking | As discovered |
| EPIC.md | Large initiatives | Per epic |
| HOTFIX.md | Emergency procedures | As needed |

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
