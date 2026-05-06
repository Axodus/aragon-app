#  #SPRINT-002 - HarmonyVoting Frontend UI & UX Production Release

**Repository:** aragon-app (Axodus/aragon-app)  
**Sprint Duration:** 6 weeks (2026-01-21 → 2026-02-28)  
**Priority Focus:** Plugin Setup & Install Flows → UI Resilience → E2E Testing  
**Total Capacity:** 120h

---

## FEATURE-001: Plugin Setup & Forms [area:frontend, area:contracts] [priority:HIGH]

**Status:** 100% complete (11/11 subtasks done, 0h remaining)  
**Completion %:** 100%  
**Remaining Effort:** 0h

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

---

## FEATURE-002: Install & Prepare Flows [area:frontend, area:contracts] [priority:HIGH]

**Status:** 50% complete (1/2 subtasks done, 12h remaining)  
**Completion %:** 50%  
**Remaining Effort:** 12h

- [x] Implement setup form with all inputs + validation [labels:type:feature, area:frontend] [status:DONE] [priority:high] [estimate:8h] [start:2026-01-20] [end:2026-01-21]
- [ ] Verify prepare installation with validator address [labels:type:qa, area:frontend] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-22] [end:2026-01-23]
- [ ] Display prepare errors clearly to user [labels:type:task, area:frontend] [status:TODO] [priority:high] [estimate:8h] [start:2026-01-24] [end:2026-01-25]

---

## FEATURE-003: UI Resilience & Fallbacks [area:frontend, area:indexing] [priority:HIGH]

**Status:** 33% complete (1/5 subtasks done, 18h remaining)  
**Completion %:** 33%  
**Remaining Effort:** 18h

- [x] Fix: Address normalization (case sensitivity) [labels:type:bug, area:frontend] [status:DONE] [priority:medium] [estimate:2h] [start:2026-01-16] [end:2026-01-17]
- [ ] Render proposals without metadata (placeholder fallback) [labels:type:feature, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:6h] [start:2026-01-22] [end:2026-01-24]
- [ ] Handle backend unavailability gracefully (no crashes) [labels:type:feature, area:frontend] [status:TODO] [priority:high] [estimate:6h] [start:2026-01-25] [end:2026-01-27]
- [ ] Implement async metadata fetching + timeout [labels:type:task, area:frontend] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-28] [end:2026-01-29]
- [ ] Clear loading states for backend-driven operations [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-01-30] [end:2026-01-31]

---

## FEATURE-004: Plugin Uninstall UX [area:frontend, area:indexing] [priority:HIGH]

**Status:** 0% complete (0/4 subtasks done, 16h remaining)  
**Completion %:** 0%  
**Remaining Effort:** 16h

- [ ] Uninstall confirmation dialog with warnings [labels:type:feature, area:frontend] [status:TODO] [priority:high] [estimate:6h] [start:2026-02-05] [end:2026-02-06]
- [ ] Handle "plugin removed" state in UI (message + options) [labels:type:feature, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-02-07] [end:2026-02-07]
- [ ] Enable re-install after uninstall [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:3h] [start:2026-02-08] [end:2026-02-08]
- [ ] Show permission cleanup status if applicable [labels:type:task, area:frontend] [status:TODO] [priority:low] [estimate:3h] [start:2026-02-09] [end:2026-02-09]

---

## FEATURE-005: Native-Token Execution Display [area:frontend, area:contracts] [priority:MEDIUM]

**Status:** 25% complete (1/4 subtasks done, 12h remaining)  
**Completion %:** 25%  
**Remaining Effort:** 12h

- [x] Receive native-token execution data from backend/indexing [labels:type:task, area:frontend, area:indexing] [status:DONE] [priority:medium] [estimate:2h] [start:2026-02-02] [end:2026-02-02]
- [ ] Display native-token value in execution review [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:4h] [start:2026-02-10] [end:2026-02-11]
- [ ] Show fee breakdown for transactions [labels:type:task, area:frontend] [status:TODO] [priority:medium] [estimate:4h] [start:2026-02-12] [end:2026-02-12]
- [ ] Handle native-token rejection gracefully [labels:type:feature, area:frontend] [status:TODO] [priority:low] [estimate:4h] [start:2026-02-13] [end:2026-02-13]

---

## TASK-001: Network Definition Updates [area:frontend, area:infra] [priority:HIGH]

**Status:** 0% complete (0/1 subtask done, 8h remaining)  
**Completion %:** 0%  
**Remaining Effort:** 8h

- [ ] Update networkDefinitions.ts with Harmony plugin addresses [labels:type:task, area:frontend, area:infra] [status:TODO] [priority:high] [estimate:2h] [start:2026-01-28] [end:2026-01-28]
- [ ] Verify network switch reloads plugin configuration [labels:type:qa, area:frontend] [status:TODO] [priority:high] [estimate:6h] [start:2026-01-29] [end:2026-01-30]

---

## TASK-002: Documentation & Testing Notes [area:docs, area:testing] [priority:MEDIUM]

**Status:** 0% complete (0/1 subtask done, 4h remaining)  
**Completion %:** 0%  
**Remaining Effort:** 4h

- [ ] Document E2E UI flow with screenshots [labels:type:docs, area:docs, area:testing] [status:TODO] [priority:medium] [estimate:4h] [start:2026-02-20] [end:2026-02-21]

---

## Sprint Risks & Mitigations

| Risk | Severity | Mitigation | Owner |
|------|----------|-----------|-------|
| Backend API unavailable | High | UI fallback to placeholder | Frontend |
| Metadata fetch timeout | Medium | Async loading with timeout | Frontend |
| Network switch lag | Low | Reload config on switch | Frontend |
| Address case sensitivity | Low | Normalize all addresses | Frontend |
| Schedule slippage | Medium | Daily standups + backlog | PM |

---

## Cross-Repository Dependencies

| Dependency | Repository | Target | Owner | ETA |
|-----------|-----------|--------|-------|-----|
| Metadata API | Aragon-app-backend | Fallback endpoint | Backend | 2026-01-27 |
| Plugin addresses | AragonOSX | Deployed addresses | Contracts | 2026-01-22 |
| Event schemas | AragonOSX/subgraph | Updated schemas | Backend | 2026-01-20 |

---

## Weekly Status Update Template

**Week 1 (2026-01-21 to 2026-01-27):**
- FEATURE-001 (Forms): 100% → COMPLETE ✅
- FEATURE-002 (Install): 0% → TARGET 50%
- FEATURE-003 (Resilience): 0% → TARGET 33%
- Blockers: Awaiting backend metadata API
- Next week focus: Install flow verification, resilience implementation

---

## FEATURE-004: Uninstall UX & Post-Uninstall State [area:frontend, area:indexing] [priority:HIGH]

**Description:** Implement clear uninstall warnings and ensure plugin removal cleans up UI state.

- [ ] Uninstall UX with clear warnings and post-uninstall state [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:8h] [start:2026-01-28] [end:2026-01-28]
- [ ] Plugin removal cleans UI (no stale entries) [labels:type:task, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-29] [end:2026-01-29]

---

## FEATURE-005: Native-Token UX [area:frontend] [priority:MEDIUM]

**Description:** Display correct fee/value semantics in proposal review and execution screens.

- [ ] Show correct fee/value semantics in review and execution [labels:type:feature, area:frontend] [status:TODO] [priority:medium] [estimate:6h] [start:2026-02-03] [end:2026-02-03]

---

## TASK-001: E2E Monitoring & QA [area:frontend, area:testing] [priority:HIGH]

**Description:** Verify proposals appear in UI and run full E2E checklist.

- [ ] Verify proposals appear in UI after creation (monitoring) [labels:type:qa, area:frontend, area:indexing] [status:TODO] [priority:high] [estimate:4h] [start:2026-01-27] [end:2026-01-27]
- [ ] Harmony E2E checklist (App) [labels:type:qa, area:testing] [status:TODO] [priority:high] [estimate:4h] [start:2026-02-04] [end:2026-02-04]

---

## Sprint Status

- **Total items:** 15
- **Completed:** 11
- **In progress:** 0
- **Not started:** 4
- **Completion:** 73%
