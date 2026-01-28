# #PLAN-002 - HarmonyVoting Frontend UI & UX Production Release [key:01KFRBVBMA607DDS5DR2GFJ2VM]

**Repository:** aragon-app (Axodus/aragon-app)  
**End Date Goal:** 2026-02-28  
**Priority:** HIGH  
**Estimative Hours:** 120h  
**Status:** in progress
**Sprint #1 (Validator Address Setup):** ✅ COMPLETED 2026-01-23

---

## Executive Summary

Complete HarmonyVoting frontend implementation with resilient UI/UX, graceful degradation, plugin uninstall flows, and metadata fallback support. Integrated with contracts and backend APIs.

### Key Metrics

- **Total Planned Work:** 120h
- **Completion:** 50% (13 of 26 sprint items done) — Sprint #1 complete, Phase 2 ready
- **Active Features:** 5 (Setup Forms ✅, Install Flows, UI Resilience, Uninstall UX, Native-Token)
- **Open Bugs:** 0 (All Sprint #1 items resolved)
- **Timeline:** 2026-01-13 → 2026-02-28
- **Sprint #1 Summary:** 5/5 tasks completed (validator address, address normalization, proposal settings, form state, error display)

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

## Subtasks (Linked)

### FEATURE-001: Plugin Setup & Forms ✅ SPRINT #1 COMPLETE [key:01KFRBVBMB1DFPXVV283V27E3K]
[labels:type:feature, area:frontend] [status:DONE] [priority:HIGH] [estimate:20h] [start:2026-01-13] [end:2026-01-23]

- [x] Add validator address input to setup form [labels:type:task, area:frontend] [status:DONE] [priority:HIGH] [estimate:4h] [start:2026-01-13] [end:2026-01-14] [key:01KFRBVBMB1DFPXVV283V27E3M]
- [x] Encode validator address into installation params [labels:type:task, area:frontend] [status:DONE] [priority:HIGH] [estimate:3h] [start:2026-01-14] [end:2026-01-15] [key:01KFRBVBMB1DFPXVV283V27E3N]
- [x] Normalize addresses to lowercase [labels:type:task, area:frontend] [status:DONE] [priority:MEDIUM] [estimate:2h] [start:2026-01-15] [end:2026-01-15] [key:01KFRBVBMB1DFPXVV283V27E3P]
- [x] Add proposal settings (dates, snapshot block) [labels:type:task, area:frontend] [status:DONE] [priority:HIGH] [estimate:6h] [start:2026-01-16] [end:2026-01-18] [key:01KFRBVBMB1DFPXVV283V27E3Q]
- [x] Register proposal/vote builders [labels:type:task, area:frontend] [status:DONE] [priority:HIGH] [estimate:5h] [start:2026-01-18] [end:2026-01-23] [key:01KFRBVBMB1DFPXVV283V27E3R]

## Progress Update (2026-01-28)

- Sprint #1 (Validator Address Setup) — COMPLETED (2026-01-23)
- Completed items (FEATURE-001):
	- `Add validator address input to setup form` — DONE
	- `Encode validator address into installation params` — DONE
	- `Normalize addresses to lowercase` — DONE
	- `Add proposal settings (dates, snapshot block)` — DONE
	- `Register proposal/vote builders` — DONE

- Completed items (FEATURE-002):
	- `Verify prepare installation with validator address` — DONE

- New work created:
	- `FEATURE-004: Break-glass: disable bricked plugin via permission revoke` — created and tracked in `docs/plans/FEATURE_break-glass_plugin_disable.md`

Notes: Current completion for the plan is 50% (Sprint #1 finished). Ongoing work focuses on Install & Prepare flows and UI resilience.

### FEATURE-002: Install & Prepare Flows [key:01KFRBVBMB1DFPXVV283V27E3S]
[labels:type:feature, area:frontend] [status:IN_PROGRESS] [priority:HIGH] [estimate:20h] [start:2026-01-20] [end:2026-02-04]

- [x] Implement setup form + validator input [labels:type:task, area:frontend] [status:DONE] [priority:HIGH] [estimate:4h] [start:2026-01-20] [end:2026-01-21] [key:01KFRBVBMB1DFPXVV283V27E3T]
- [x] Verify prepare installation with validator address [labels:type:task, area:frontend] [status:DONE] [priority:HIGH] [estimate:6h] [start:2026-01-22] [end:2026-01-24] [key:01KFRBVBMB1DFPXVV283V27E3V]
- [ ] Display prepare errors clearly to user [labels:type:task, area:frontend] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-01-25] [end:2026-01-27] [key:01KFRBVBMB1DFPXVV283V27E3W]
- [ ] Test form submission + state recovery [labels:type:qa, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:6h] [start:2026-01-28] [end:2026-02-04] [key:01KFRBVBMB1DFPXVV283V27E3X]

### FEATURE-003: UI Resilience & Fallbacks [key:01KFRBVBMB1DFPXVV283V27E3Y]
[labels:type:feature, area:frontend] [status:IN_PROGRESS] [priority:HIGH] [estimate:24h] [start:2026-01-22] [end:2026-02-11]

- [ ] Render proposals without metadata (placeholder fallback) [labels:type:feature, area:frontend, area:indexing] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-01-22] [end:2026-01-22] [key:01KFRBVBMC54B57ANM4J893ZKA]
- [ ] Handle backend unavailability gracefully [labels:type:feature, area:frontend] [status:TODO] [priority:HIGH] [estimate:6h] [start:2026-01-22] [end:2026-01-23] [key:01KFRBVBMC54B57ANM4J893ZKB]
- [ ] User-friendly and actionable error messages [labels:type:task, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:3h] [start:2026-01-23] [end:2026-01-23] [key:01KFRBVBMC54B57ANM4J893ZKC]
- [ ] Clear loading states for backend-driven operations [labels:type:task, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:3h] [start:2026-01-23] [end:2026-01-23] [key:01KFRBVBMC54B57ANM4J893ZKD]
- [ ] Network switch reloads plugin configuration correctly [labels:type:task, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:3h] [start:2026-01-24] [end:2026-01-24] [key:01KFRBVBMC54B57ANM4J893ZKE]
- [ ] Implement fallback metadata fetching [labels:type:task, area:frontend] [status:TODO] [priority:HIGH] [estimate:5h] [start:2026-02-05] [end:2026-02-11] [key:01KFRBVBMC54B57ANM4J893ZKF]

### FEATURE-004: Plugin Uninstall UX [key:01KFRBVBMC54B57ANM4J893ZKG]
[labels:type:feature, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:20h] [start:2026-02-05] [end:2026-02-18]

- [ ] Uninstall confirmation dialog with clear warnings [labels:type:feature, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:6h] [start:2026-02-05] [end:2026-02-07] [key:01KFRBVBMC54B57ANM4J893ZKH]
- [ ] Handle post-uninstall state (plugin removed message) [labels:type:task, area:frontend] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-02-08] [end:2026-02-10] [key:01KFRBVBMC54B57ANM4J893ZKJ]
- [ ] Plugin removal cleans UI (no stale entries) [labels:type:task, area:frontend, area:indexing] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-02-11] [end:2026-02-14] [key:01KFRBVBMC54B57ANM4J893ZKK]
- [ ] Enable re-install after uninstall [labels:type:task, area:frontend] [status:TODO] [priority:HIGH] [estimate:6h] [start:2026-02-15] [end:2026-02-18] [key:01KFRBVBMC54B57ANM4J893ZKM]

### FEATURE-005: Native-Token Execution UX [key:01KFRBVBMC54B57ANM4J893ZKN]
[labels:type:feature, area:frontend] [status:IN_PROGRESS] [priority:MEDIUM] [estimate:18h] [start:2026-01-28] [end:2026-02-16]

- [ ] Display native-token value in execution review [labels:type:feature, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:6h] [start:2026-02-03] [end:2026-02-05] [key:01KFRBVBMC54B57ANM4J893ZKP]
- [ ] Show fee breakdown for transactions [labels:type:task, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:4h] [start:2026-02-06] [end:2026-02-08] [key:01KFRBVBMC54B57ANM4J893ZKQ]
- [ ] Confirm receipt after execution [labels:type:task, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:4h] [start:2026-02-09] [end:2026-02-12] [key:01KFRBVBMC54B57ANM4J893ZKR]
- [ ] Handle native-token rejection gracefully [labels:type:task, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:4h] [start:2026-02-13] [end:2026-02-16] [key:01KFRBVBMC54B57ANM4J893ZKS]

### FEATURE-006: E2E Testing & Release [key:01KFRBVBMC54B57ANM4J893ZKT]
[labels:type:feature, area:qa, area:testing] [status:TODO] [priority:CRITICAL] [estimate:28h] [start:2026-02-19] [end:2026-02-28]

- [ ] E2E flow tests (Playwright/Cypress) [labels:type:test, area:frontend] [status:TODO] [priority:HIGH] [estimate:8h] [start:2026-02-19] [end:2026-02-21] [key:01KFRBVBMC54B57ANM4J893ZKV]
- [ ] Cross-browser testing (Chrome, Firefox, Safari) [labels:type:qa, area:frontend] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-02-22] [end:2026-02-22] [key:01KFRBVBMC54B57ANM4J893ZKW]
- [ ] Mobile responsiveness testing [labels:type:qa, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:4h] [start:2026-02-23] [end:2026-02-23] [key:01KFRBVBMC54B57ANM4J893ZKX]
- [ ] Accessibility audit (WCAG 2.1 AA) [labels:type:qa, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:4h] [start:2026-02-24] [end:2026-02-24] [key:01KFRBVBMC54B57ANM4J893ZKY]
- [ ] Performance benchmarks (UI latency, bundle size) [labels:type:qa, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:4h] [start:2026-02-25] [end:2026-02-26] [key:01KFRBVBMC54B57ANM4J893ZKZ]
- [ ] Verify proposals appear in UI after creation [labels:type:qa, area:frontend, area:indexing] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-02-27] [end:2026-02-28] [key:01KFRBVBMC54B57ANM4J893ZM0]

### TASK-001: Cross-Repo Admin Grant [key:01KFRBVBMC54B57ANM4J893ZM1]
[labels:type:maintenance, area:infra, cross-repo] [status:DONE] [priority:HIGH] [estimate:4h] [start:2026-01-20] [end:2026-01-20]

- [x] Admin grant completed on AragonOSX repo [labels:type:task, area:contracts] [status:DONE] [priority:HIGH] [estimate:4h] [start:2026-01-20] [end:2026-01-20] [key:01KFRBVBMC54B57ANM4J893ZM2]

### TASK-002: ProjectV2 Schema & Sync [key:01KFRBVBMC54B57ANM4J893ZM3]
[labels:type:task, area:planning] [status:TODO] [priority:LOW] [estimate:4h] [start:2026-01-19] [end:2026-01-19]

- [ ] Verify .gitissue/metadata.config.json at repo root [labels:type:chore, area:planning] [status:TODO] [priority:LOW] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19] [key:01KFRBVBMC54B57ANM4J893ZM4]
- [ ] Capture org project schema to tmp/<org>-project-schema.json [labels:type:task, area:planning] [status:TODO] [priority:LOW] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19] [key:01KFRBVBMC54B57ANM4J893ZM5]
- [ ] Generate .gitissue/metadata.generated.json from PLAN.md [labels:type:task, area:planning] [status:TODO] [priority:LOW] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19] [key:01KFRBVBMC54B57ANM4J893ZM6]
- [ ] Prepare gh issue create/edit commands for project sync [labels:type:docs, area:planning] [status:TODO] [priority:LOW] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19] [key:01KFRBVBMC54B57ANM4J893ZM7]
- [ ] Document PARENT_ISSUE limitation workaround [labels:type:docs, area:planning] [status:TODO] [priority:LOW] [estimate:0.5h] [start:2026-01-19] [end:2026-01-19] [key:01KFRBVBMC54B57ANM4J893ZM8]

---

## Milestones

- **Milestone 1:** Plugin Setup & Forms — 2026-01-13 → 2026-01-21 — ✅ DONE
- **Milestone 2:** Install & Prepare Flows — 2026-01-20 → 2026-02-04 — 🔄 50%
- **Milestone 3:** UI Resilience & Fallbacks — 2026-01-22 → 2026-02-11 — 🔄 33%
- **Milestone 4:** Plugin Uninstall UX — 2026-02-05 → 2026-02-18 — ⬜ 0%
- **Milestone 5:** Native-Token Execution UX — 2026-01-28 → 2026-02-16 — 🔄 25%
- **Milestone 6:** E2E Testing & Release — 2026-02-19 → 2026-02-28 — ⬜ 0%
- **Production Go-Live:** 2026-02-28

---

## Notes

### Related Documents

- [uninstall-fix.md](uninstall-fix.md) — Uninstall fix validation and rollback strategy
- [PLAN_subtasks.md](PLAN_subtasks.md) — Detailed checklists for top-priority items
- [ISSUES_TO_CREATE.md](ISSUES_TO_CREATE.md) — Ready-to-create issues with gh CLI commands

### Cross-Repo Plans

- [AragonOSX PLAN](../../../AragonOSX/docs/plans/PLAN.md) — Contracts and master E2E coordination
- [Aragon-app-backend PLAN](../../../Aragon-app-backend/docs/plans/PLAN.md) — Backend indexing

---

**Version:** 2.1  
**Last Updated:** 2026-01-28  
**Sprint #1 Status:** ✅ COMPLETE (5/5 tasks, 0 bugs, ready for Phase 2)
**Template:** [PLAN.md](https://gist.github.com/mzfshark/2ab8856d6c0efc0dfa9d1f98d2a23fdf)
